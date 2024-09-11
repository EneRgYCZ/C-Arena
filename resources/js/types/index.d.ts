import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Toast {
    title: string;
    description: string;
    timeout: number;
    action: null | {
        label: string;
        redirect: string;
    };
    type: "success" | "danger" | "info" | "warning";
}

export interface PaginatedResponse<T> {
    current_page: number;
    data: Array<T>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
}

export interface QueryBuilderColumn {
    key: string;
    label: string;
    can_be_hidden: boolean;
    hidden: boolean;
    sortable: boolean;
    sorted: boolean | string;
    sort_number: number | null;
}

export interface QueryBuilderSearchInput {
    key: string;
    label: string;
    value: null | string;
    shown: boolean;
}

export interface QueryBuilderProps {
    columns: Array<QueryBuilderColumn>;

    searchInputs: Array<QueryBuilderSearchInput>;

    sort: null | string;
    defaultSort: string;

    cursor: null | string;
    page: number;
    pageName: string;
    perPageOptions: Array<number>;
    perPage: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
    toast?: Toast;
    ziggy: Config & { location: string };
};
export interface PaginatedResponse<T> {
    current_page: number;
    data: Array<T>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    next_page_url: null | string;
    path: string;
    per_page: number;
    prev_page_url: null | string;
    to: number;
    total: number;
}

export interface Problem {
    id: number;
    name: string;
    description: string;
    input: string;
    output: string;
    example_input: string;
    example_output: string;
    updated_at: string;
    created_at: string;
}

export interface Submission {
    id: number;
    problem_id: number;
    problem: Problem | null;
    user_id: number;
    user: User;
    score: number;
    error_message: string | null;
    updated_at: string;
    created_at: string;
}
