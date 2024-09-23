import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { LeaderboardElement } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Dashboard({
    solvedProblemsToday,
    solvedProblemsTodayComparison,
    solvedProblemsLast7Days,
    solvedProblemsLast7DaysComparison,
    solvedProblemsLast14Days,
    solvedProblemsLast14DaysComparison,
    solvedProblemsLast30Days,
    solvedProblemsLast30DaysComparison,
    leaderboard
}: {
    solvedProblemsToday: number;
    solvedProblemsTodayComparison: number;
    solvedProblemsLast7Days: number;
    solvedProblemsLast7DaysComparison: number;
    solvedProblemsLast14Days: number;
    solvedProblemsLast14DaysComparison: number;
    solvedProblemsLast30Days: number;
    solvedProblemsLast30DaysComparison: number;
    leaderboard: Array<LeaderboardElement>;
}) {
    console.log(leaderboard);
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-lg text-gray-(text-gray-200) leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-wrap justify-around gap-4 p-6">
                            <h3 className="w-full text-center font-semibold text-xl mb-4">Problems Solved</h3>
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="font-semibold text-lg">Today</h3>
                                <h2 className="font-semibold text-lg">
                                    {solvedProblemsToday}
                                    {solvedProblemsToday > solvedProblemsTodayComparison ? (
                                        <span className="text-green-500 ml-2">↑</span>
                                    ) : solvedProblemsToday < solvedProblemsTodayComparison ? (
                                        <span className="text-red-500 ml-2">↓</span>
                                    ) : (
                                        <span className="text-gray-500 ml-2">-</span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500">Compared to {solvedProblemsTodayComparison}</p>
                            </div>
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="font-semibold text-lg">Last 7 Days</h3>
                                <h2 className="font-semibold text-lg">
                                    {solvedProblemsLast7Days}
                                    {solvedProblemsLast7Days > solvedProblemsLast7DaysComparison ? (
                                        <span className="text-green-500 ml-2">↑</span>
                                    ) : solvedProblemsLast7Days < solvedProblemsLast7DaysComparison ? (
                                        <span className="text-red-500 ml-2">↓</span>
                                    ) : (
                                        <span className="text-gray-500 ml-2">-</span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500">Compared to {solvedProblemsLast7DaysComparison}</p>
                            </div>
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="font-semibold text-lg">Last 14 Days</h3>
                                <h2 className="font-semibold text-lg">
                                    {solvedProblemsLast14Days}
                                    {solvedProblemsLast14Days > solvedProblemsLast14DaysComparison ? (
                                        <span className="text-green-500 ml-2">↑</span>
                                    ) : solvedProblemsLast14Days < solvedProblemsLast14DaysComparison ? (
                                        <span className="text-red-500 ml-2">↓</span>
                                    ) : (
                                        <span className="text-gray-500 ml-2">-</span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Compared to {solvedProblemsLast14DaysComparison}
                                </p>
                            </div>
                            <div className="text-gray-900 dark:text-gray-100">
                                <h3 className="font-semibold text-lg">Last 30 Days</h3>
                                <h2 className="font-semibold text-lg">
                                    {solvedProblemsLast30Days}
                                    {solvedProblemsLast30Days > solvedProblemsLast30DaysComparison ? (
                                        <span className="text-green-500 ml-2">↑</span>
                                    ) : solvedProblemsLast30Days < solvedProblemsLast30DaysComparison ? (
                                        <span className="text-red-500 ml-2">↓</span>
                                    ) : (
                                        <span className="text-gray-500 ml-2">-</span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Compared to {solvedProblemsLast30DaysComparison}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex flex-wrap justify-around gap-4 p-6">
                            <h3 className="w-full text-center font-semibold text-xl mb-4">Leaderboard</h3>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Rank
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            User
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        >
                                            Problems Solved
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {leaderboard.slice(0, 15).map((entry, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {index + 1}
                                                {index === 0 && <span className="ml-2">👑</span>}
                                                {index === 1 && <span className="ml-2">🥈</span>}
                                                {index === 2 && <span className="ml-2">🥉</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {entry.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {entry.total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
