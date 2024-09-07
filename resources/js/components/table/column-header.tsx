import { QueryBuilderColumn } from "@/types";

import React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

import { Box, ButtonGroup, IconButton, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";

const ColumnHeader: React.FC<{
    col: QueryBuilderColumn;
    sortRemoveHandler: () => void;
    sortChangeHandler: () => void;
}> = ({ col, sortRemoveHandler, sortChangeHandler }) => {
    return (
        <th key={col.key} style={{ minHeight: 32 }}>
            {col.sortable ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}>
                    <Typography
                        sx={{
                            textTransform: "uppercase",
                            lineHeight: "32px"
                        }}
                    >
                        {col.label}
                    </Typography>

                    <ButtonGroup size="sm">
                        <IconButton
                            onClick={e => {
                                e.preventDefault();
                                sortChangeHandler();
                            }}
                        >
                            {!col.sorted && <FaSort />}

                            {col.sorted === "asc" && <FaSortUp />}

                            {col.sorted === "desc" && <FaSortDown />}
                        </IconButton>

                        {col.sort_number !== null && <Button disabled>{col.sort_number}</Button>}

                        {col.sort_number !== null && (
                            <Button
                                onClick={e => {
                                    e.preventDefault();
                                    sortRemoveHandler();
                                }}
                            >
                                Sterge din sortare
                            </Button>
                        )}
                    </ButtonGroup>
                </Box>
            ) : (
                <Typography sx={{ textTransform: "uppercase" }}>{col.label}</Typography>
            )}
        </th>
    );
};

export default ColumnHeader;
