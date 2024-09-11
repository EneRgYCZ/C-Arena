import { QueryBuilderColumn } from "@/types";

import React, { useRef } from "react";
import { useState } from "react";
import { HiOutlineEyeSlash } from "react-icons/hi2";

import { Box, FormControl, FormLabel, IconButton, ListItem, Menu, Switch, Typography } from "@mui/joy";

const ColumnToggler: React.FC<{
    columns: Array<QueryBuilderColumn>;
    columnToggledHandler: (column: QueryBuilderColumn, state: boolean) => void;
}> = ({ columns, columnToggledHandler }) => {
    const hasHiddenColumns = columns.reduce(
        (accumulator, currentValue) => (accumulator === true ? accumulator : currentValue.hidden),
        false
    );

    const IndividualToggle: React.FC<{
        column: QueryBuilderColumn;
    }> = ({ column }) => {
        const [hidden, setHidden] = useState(column.hidden);

        return (
            <FormControl orientation="horizontal">
                <Box>
                    <FormLabel>
                        <Typography sx={{ textTransform: "uppercase" }}>{column.label}</Typography>
                    </FormLabel>
                </Box>
                <Switch
                    checked={hidden}
                    onChange={e => {
                        setHidden(e.target.checked);
                        columnToggledHandler(column, e.target.checked);
                    }}
                    color={hidden ? "primary" : "neutral"}
                    variant="outlined"
                />
            </FormControl>
        );
    };

    const [open, setOpen] = useState(false);
    const togglerRef = useRef(null);

    return (
        <>
            <IconButton
                ref={togglerRef}
                variant="outlined"
                color={hasHiddenColumns ? "primary" : "neutral"}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <HiOutlineEyeSlash />
            </IconButton>

            <Menu anchorEl={togglerRef.current} open={open} onClose={() => setOpen(false)}>
                {columns.map(col => {
                    return (
                        <ListItem key={col.key}>
                            <IndividualToggle column={col} />
                        </ListItem>
                    );
                })}
            </Menu>
        </>
    );
};

export default ColumnToggler;
