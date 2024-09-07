import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PageProps, Problem } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";

export default function Show({
    problem,
}: PageProps<{
    problem: Problem;
}>) {
    const [code, setCode] = React.useState<string>();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Problems
                </h2>
            }
        >
            <Head title="Problems" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="font-semibold text-3xl">Title:</div>
                            <div className="font-semibold text-xl">
                                <div className="flex items-center">
                                    <div className="bg-blue-500 text-white font-bold py-1 px-2 rounded mr-2">
                                        #{problem.id}
                                    </div>
                                    <div>{problem.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
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

            <div className="py-12">
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
                                    value={code}
                                    language="cpp"
                                    data-color-mode="dark"
                                    placeholder="Please enter C++ code."
                                    padding={15}
                                    onChange={(evn: {
                                        target: {
                                            value: React.SetStateAction<undefined>;
                                        };
                                    }) => setCode(evn.target.value)}
                                    height={500}
                                    style={{
                                        fontSize: 17,
                                        fontFamily:
                                            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                                    }}
                                />
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1">
                                Upload File
                            </button>
                            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
