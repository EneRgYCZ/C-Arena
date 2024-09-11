import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PageProps, Problem, Submission } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import { Box, Button, FormControl, styled, Typography } from "@mui/joy";
import { FiUpload } from "react-icons/fi";

export function saveStateToFile(
    state: string | undefined,
    extension: string = "cpp"
) {
    const fs = require("fs");

    return new Promise((resolve, reject) => {
        fs.writeFile(`${state}.${extension}`, state, (err: unknown) => {
            if (err) reject(err);
            else resolve(err);
        });
    });
}

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
}: PageProps<{
    problem: Problem;
    lastSubmission: Submission;
    bestSubmission: Submission;
}>) {
    const { data, setData, errors, processing, post, reset } = useForm<{
        file: File | null;
        code: string;
    }>({
        file: null,
        code: ""
    });

    const CPP_MIMES = ".cpp, text/x-c, file";

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    <div className="flex items-center">
                        <div className="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2">
                            #{problem.id}
                        </div>
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="font-semibold text-3xl">
                                Question:
                            </div>
                            {problem.description}
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-rows-2 gap-4">
                                <div>
                                    <div className="font-semibold text-3xl">
                                        Input:
                                    </div>
                                    <p>{problem.input}</p>
                                </div>
                                <div>
                                    <div className="font-semibold text-3xl">
                                        Output:
                                    </div>
                                    <p>{problem.output}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="font-semibold text-3xl">
                                        Example Input:
                                    </div>
                                    <p>{problem.example_input}</p>
                                </div>
                                <div>
                                    <div className="font-semibold text-3xl">
                                        Example Output:
                                    </div>
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
                            {lastSubmission !== null && (
                                <div className="p-6 text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="font-semibold text-3xl mr-2">
                                            Last Submission:
                                        </div>
                                        {lastSubmission.error_message ? (
                                            <div>
                                                <p
                                                    style={{
                                                        fontSize: 26,
                                                        color: "red",
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
                                                        lastSubmission.score <
                                                        30
                                                            ? "red"
                                                            : lastSubmission.score <
                                                              60
                                                            ? "yellow"
                                                            : "green",
                                                }}
                                            >
                                                {lastSubmission.score}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 16,
                                            color: "red",
                                        }}
                                    >
                                        {lastSubmission.error_message
                                            ? lastSubmission.error_message
                                                  .split("\n")
                                                  .map((text, index) => (
                                                      <React.Fragment
                                                          key={index}
                                                      >
                                                          {text}
                                                          <br />
                                                      </React.Fragment>
                                                  ))
                                            : null}
                                    </div>
                                </div>
                            )}
                            {bestSubmission !== null && (
                                <div className="p-6 text-gray-900 dark:text-gray-100 border border-gray-300 rounded-lg mt-4">
                                    <div className="flex items-center">
                                        <div className="font-semibold text-3xl mr-2">
                                            Best Submission:
                                        </div>
                                        <p
                                            style={{
                                                fontSize: 26,
                                                color:
                                                    bestSubmission.score < 30
                                                        ? "red"
                                                        : bestSubmission.score <
                                                          60
                                                        ? "yellow"
                                                        : "green",
                                            }}
                                        >
                                            {bestSubmission.score}
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
                            <h2 className="font-semibold text-3xl">
                                Solution:
                            </h2>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div style={{ height: 500, overflow: "auto" }}>
                                <CodeEditor
                                    value={data.code}
                                    language="cpp"
                                    data-color-mode="dark"
                                    placeholder="Please enter C++ code."
                                    padding={15}
                                    onChange={(evn: {
                                        target: {
                                            value: React.SetStateAction<
                                                string | undefined
                                            >;
                                        };
                                    }) =>
                                        setData(
                                            "code",
                                            evn.target.value as string
                                        )
                                    }
                                    style={{
                                        fontSize: 17,
                                        fontFamily:
                                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                        height: 3000,
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
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    post(
                                        route(
                                            "problems.submit-solution",
                                            problem.id
                                        ),
                                        {
                                            onSuccess: () => {
                                                setData("file", null);
                                                setData("code", "");
                                            },
                                            preserveScroll: true,
                                        }
                                    );
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
                                        {data.file
                                            ? data.file.name
                                            : "Upload File"}
                                        <VisuallyHiddenInput
                                            accept={CPP_MIMES}
                                            type="file"
                                            onChange={(e) => {
                                                if (
                                                    e.target.files &&
                                                    e.target.files.length > 0
                                                ) {
                                                    setData(
                                                        "file",
                                                        e.target.files[0]
                                                    );
                                                }
                                            }}
                                        />
                                    </Button>
                                    {errors.file && (
                                        <Typography
                                            color="danger"
                                            variant="plain"
                                        >
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
        </AuthenticatedLayout>
    );
}
