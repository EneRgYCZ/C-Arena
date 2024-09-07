import { useDebounce } from "@/hooks/useDebounce";
import { QueryBuilderSearchInput } from "@/types";

import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";

import { IconButton, Input, Tooltip, Typography } from "@mui/joy";

const SearchInput: React.FC<{
    input: QueryBuilderSearchInput;
    searchUpdatedHandler: (input: QueryBuilderSearchInput, newValue: string) => void;
}> = ({ input, searchUpdatedHandler }) => {
    const [value, setValue] = useState(input.value ?? "");

    const updateSearchInputValue = () => {
        searchUpdatedHandler(input, value);
    };

    const debouncedUpdateSearchInputValue = useDebounce(updateSearchInputValue, 500);

    return (
        <Input
            sx={{ "--Input-decoratorChildHeight": "45px" }}
            value={value}
            onChange={e => {
                setValue(e.target.value);
                debouncedUpdateSearchInputValue();
            }}
            startDecorator={
                <Typography
                    level="title-sm"
                    sx={{
                        pr: 1,
                        borderRight: "var(--variant-borderWidth) solid",
                        borderColor: "var(--joy-palette-neutral-outlinedBorder, var(--joy-palette-neutral-300))"
                    }}
                >
                    {input.label}
                </Typography>
            }
            endDecorator={
                <Tooltip title="Clear selection" placement="top">
                    <IconButton
                        sx={{ borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }}
                        onClick={() => {
                            setValue("");
                            debouncedUpdateSearchInputValue();
                        }}
                    >
                        <HiXMark />
                    </IconButton>
                </Tooltip>
            }
        />
    );
};

export default SearchInput;
