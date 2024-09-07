import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Table } from "@/components/table/table";
import { PageProps, PaginatedResponse, Problem } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Index({
    problems,
    auth,
}: PageProps<{
    problems: PaginatedResponse<Problem>;
    auth: PageProps;
}>) {
    return (
        <AuthenticatedLayout
            user={auth.user}
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
                            <Table<Problem> data={problems} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}