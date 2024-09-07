import { router } from "@inertiajs/react";

import React from "react";

import { Box, Button, Card, Option, Select, Stack, Typography } from "@mui/joy";

const Paginator: React.FC<{
    perPageOptions: Array<number>;
    perPageChangeHandler: (newValue: number | null) => void;
    perPage: number;
    from: number;
    to: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}> = ({ perPage, perPageChangeHandler, perPageOptions, from, to, total, links }) => {
    return (
        <Card variant="outlined" sx={{ width: "100%" }} size="sm">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                >
                    {perPageOptions.length > 0 && (
                        <Select<typeof perPage>
                            defaultValue={perPage}
                            onChange={(e, newValue) => {
                                e?.preventDefault();
                                perPageChangeHandler(newValue);
                            }}
                        >
                            {perPageOptions.map(option => (
                                <Option key={option} value={option}>
                                    {option} per page
                                </Option>
                            ))}
                        </Select>
                    )}

                    <Typography>
                        <Typography>{from}</Typography> to <Typography>{to}</Typography> of{" "}
                        <Typography>{total}</Typography> results
                    </Typography>
                </Box>

                <Stack direction="row" gap={1}>
                    {links.map((link, idx) => {
                        return (
                            <Button
                                key={idx}
                                size="sm"
                                color={link.active ? "primary" : "neutral"}
                                variant={link.active ? "solid" : "soft"}
                                disabled={link.url === null}
                                onClick={() => {
                                    if (link.url) {
                                        router.get(link.url, undefined, {
                                            preserveScroll: true,
                                            preserveState: true
                                        });
                                    }
                                }}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        );
                    })}
                </Stack>
            </Box>
        </Card>
    );
};

export default Paginator;
