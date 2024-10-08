import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PageProps, Problem, Submission } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Box, Button, FormControl, styled, Typography } from "@mui/joy";
import { FiUpload } from "react-icons/fi";

const VisuallyHiddenInput = styled("input")`
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    bottom: 0;
    left: 0;
    white-space: nowrap;
    width: 1px;
`;

export default function Show({
    problem,
    lastSubmission,
    bestSubmission,
    auth
}: PageProps<{
    problem: Problem;
    lastSubmission: Submission;
    bestSubmission: Submission;
}>) {
    const { data, setData, errors, processing, post } = useForm<{
        file: File | null;
        code: string;
    }>({
        file: null,
        code: ""
    });

    const [testCaseResults, setTestCaseResults] = React.useState<number[]>([]);
    const [lastSubmissionState, setLastSubmissionState] = React.useState<Submission>(lastSubmission);
    const [bestSubmissionState, setBestSubmissionState] = React.useState<Submission>(bestSubmission);

    const [loading, setLoading] = React.useState<boolean>(false);

    React.useEffect(() => {
        const userId = auth.user.id;

        const channel = window.Echo.private(`test-case-results.${userId}`);
        const eosChannel = window.Echo.private(`end-of-submission.${userId}`);

        // Remove previous listeners if any
        channel.stopListening("TestCaseResultUpdated");
        eosChannel.stopListening("EndSubmissionEvent");

        channel.listen("TestCaseResultUpdated", (event: { pointsPerCase: number }) => {
            setTestCaseResults(prevResults => [...prevResults, event.pointsPerCase]);
            setLoading(false);
        });

        eosChannel.listen(
            "EndSubmissionEvent",
            (eosEvent: { bestSubmission: Submission; lastSubmission: Submission }) => {
                console.log(eosEvent);
                setLastSubmissionState(eosEvent.lastSubmission);
                setBestSubmissionState(eosEvent.bestSubmission);
            }
        );

        return () => {
            channel.stopListening(`test-case-results.${userId}`);
            eosChannel.stopListening(`end-of-submission.${userId}`);
        };
    }, []);

    const CPP_MIMES = ".cpp, text/x-c";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    <div className="flex items-center">
                        <div className="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2">#{problem.id}</div>
                        <div className="flex items-center">
                            {problem.name}
                            {bestSubmission && bestSubmission.score === 100 && (
                                <span className="ml-2 text-green-500">✔️</span>
                            )}
                        </div>
                    </div>
                </h2>
            }
        >
            <Head title="Problems" />

            <div className="max-w mx-auto">
                <div className="flex h-screen overflow-hidden" style={{ flexDirection: "row", gap: 6, padding: 6 }}>
                    <div
                        style={{
                            flexBasis: "50%",
                            flexGrow: 0,
                            overflowY: "auto",
                            height: "85%"
                        }}
                    >
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="font-semibold text-3xl">Question:</div>
                                        {problem.description}
                                    </div>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="grid grid-rows-2 gap-4">
                                            <div>
                                                <div className="font-semibold text-3xl">Input:</div>
                                                <p>{problem.input}</p>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-3xl">Output:</div>
                                                <p>{problem.output}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="font-semibold text-3xl">Example Input:</div>
                                                <p>{problem.example_input}</p>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-3xl">Example Output:</div>
                                                <p>{problem.example_output}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-3">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        {lastSubmissionState !== null && (
                                            <div className="p-6 text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="font-semibold text-3xl mr-2">Last Submission:</div>
                                                    {lastSubmissionState.error_message ? (
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontSize: 26,
                                                                    color: "red"
                                                                }}
                                                            >
                                                                Compilation error
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p
                                                            style={{
                                                                fontSize: 26,
                                                                color:
                                                                    lastSubmissionState.score < 30
                                                                        ? "red"
                                                                        : lastSubmissionState.score < 60
                                                                          ? "yellow"
                                                                          : "green"
                                                            }}
                                                        >
                                                            {Math.ceil(lastSubmissionState.score)}
                                                        </p>
                                                    )}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 16,
                                                        color: "red"
                                                    }}
                                                >
                                                    {lastSubmissionState.error_message
                                                        ? lastSubmissionState.error_message
                                                              .split("\n")
                                                              .map((text, index) => (
                                                                  <React.Fragment key={index}>
                                                                      {text}
                                                                      <br />
                                                                  </React.Fragment>
                                                              ))
                                                        : null}
                                                </div>
                                            </div>
                                        )}
                                        {bestSubmissionState !== null && (
                                            <div className="p-6 text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg mt-4">
                                                <div className="flex items-center">
                                                    <div className="font-semibold text-3xl mr-2">Best Submission:</div>
                                                    <p
                                                        style={{
                                                            fontSize: 26,
                                                            color:
                                                                bestSubmissionState.score < 30
                                                                    ? "red"
                                                                    : bestSubmissionState.score < 60
                                                                      ? "yellow"
                                                                      : "green"
                                                        }}
                                                    >
                                                        {Math.floor(bestSubmissionState.score)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h2 className="font-semibold text-3xl">Test Cases:</h2>
                                        {loading && testCaseResults.reduce((acc, points) => acc + points, 0) < 100 && (
                                            <div className="flex items-center">
                                                <span>Loading...</span>
                                                <svg
                                                    className="animate-spin h-5 w-5 ml-2 text-gray-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8H4z"
                                                    ></path>
                                                </svg>
                                            </div>
                                        )}
                                        <ul>
                                            {testCaseResults.map((points, index) => (
                                                <li key={index} style={{ marginBottom: "10px" }}>
                                                    <div
                                                        style={{
                                                            border: `2px solid ${points > 0 ? "green" : "red"}`,
                                                            borderRadius: "5px",
                                                            padding: "10px",
                                                            backgroundColor: points > 0 ? "#d4edda" : "#f8d7da",
                                                            color: points > 0 ? "green" : "red"
                                                        }}
                                                    >
                                                        Test case {index + 1}: {Math.floor(points)} Points
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        {testCaseResults.length > 0 && (
                                            <ul>
                                                <li>
                                                    <div
                                                        style={{
                                                            border: `2px solid ${
                                                                testCaseResults.reduce(
                                                                    (acc, points) => acc + points,
                                                                    0
                                                                ) > 60
                                                                    ? "green"
                                                                    : testCaseResults.reduce(
                                                                            (acc, points) => acc + points,
                                                                            0
                                                                        ) >= 30
                                                                      ? "yellow"
                                                                      : "red"
                                                            }`,
                                                            borderRadius: "5px",
                                                            padding: "10px",
                                                            backgroundColor: `${
                                                                testCaseResults.reduce(
                                                                    (acc, points) => acc + points,
                                                                    0
                                                                ) > 60
                                                                    ? "#d4edda"
                                                                    : testCaseResults.reduce(
                                                                            (acc, points) => acc + points,
                                                                            0
                                                                        ) >= 30
                                                                      ? "#fff3cd"
                                                                      : "#f8d7da"
                                                            }`,
                                                            color: `${
                                                                testCaseResults.reduce(
                                                                    (acc, points) => acc + points,
                                                                    0
                                                                ) > 60
                                                                    ? "green"
                                                                    : testCaseResults.reduce(
                                                                            (acc, points) => acc + points,
                                                                            0
                                                                        ) >= 30
                                                                      ? "yellow"
                                                                      : "red"
                                                            }`
                                                        }}
                                                    >
                                                        Total score:{" "}
                                                        {testCaseResults.reduce(
                                                            (acc, points) => Math.floor(acc + points),
                                                            0
                                                        )}{" "}
                                                        {"Points"}
                                                    </div>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            flexBasis: "50%",
                            flexGrow: 0,
                            overflowY: "auto",
                            height: "85%"
                        }}
                    >
                        <div className="py-6">
                            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h2 className="font-semibold text-3xl">Solution:</h2>
                                    </div>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div style={{ height: 800, overflow: "auto" }}>
                                            <CodeEditor
                                                value={data.code}
                                                language="cpp"
                                                data-color-mode="dark"
                                                placeholder="Please enter C++ code."
                                                padding={15}
                                                onChange={(evn: {
                                                    target: {
                                                        value: React.SetStateAction<string | undefined>;
                                                    };
                                                }) => setData("code", evn.target.value as string)}
                                                style={{
                                                    fontSize: 17,
                                                    fontFamily:
                                                        "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                                    height: 3000
                                                }}
                                            />
                                            {errors.code && (
                                                <Typography color="danger" variant="plain">
                                                    {errors.code}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <form
                                            onSubmit={e => {
                                                e.preventDefault();
                                                setLoading(true);
                                                post(route("problems.submit-solution", problem.id), {
                                                    onSuccess: () => {
                                                        setData("file", null);
                                                        setData("code", "");
                                                        setTestCaseResults([]);
                                                    },
                                                    preserveScroll: true
                                                });
                                            }}
                                        >
                                            <FormControl>
                                                <Button
                                                    component="label"
                                                    role={undefined}
                                                    tabIndex={-1}
                                                    color="primary"
                                                    startDecorator={<FiUpload />}
                                                >
                                                    {data.file ? data.file.name : "Upload File"}
                                                    <VisuallyHiddenInput
                                                        accept={CPP_MIMES}
                                                        type="file"
                                                        onChange={e => {
                                                            if (e.target.files && e.target.files.length > 0) {
                                                                setData("file", e.target.files[0]);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {errors.file && (
                                                    <Typography color="danger" variant="plain">
                                                        {errors.file}
                                                    </Typography>
                                                )}
                                            </FormControl>

                                            <div>
                                                <Box sx={{ mt: 2 }}>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                        loading={processing}
                                                        fullWidth
                                                    >
                                                        Submit
                                                    </Button>
                                                </Box>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
