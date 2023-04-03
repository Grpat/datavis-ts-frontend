import React, {useState} from "react";
import {CustomAutocomplete, CustomPaper, CustomTextField} from "@/muicomponents/muiStyled";
import {Film} from "@/components/SelectMenu";

interface ChildComponentProps {
    films: Film[];
}

const SelectOption: React.FC <ChildComponentProps> = ({ films }) => {

    return (
        <div className="select-option">
            <CustomAutocomplete
                id="size-small-standard"
                size="small"
                options={films}
                getOptionLabel={(option) => (option as { title: string }).title}
                defaultValue={films[13]}
                PaperComponent={CustomPaper}
                renderInput={(params) => (
                    <CustomTextField
                        className="bg-zinc-800 hover:bg-zinc-600 rounded-sm"
                        {...params}
                        margin="normal"
                        fullWidth
                        variant="standard"
                        placeholder="Indicator"
                    />
                )}
            />
        </div>
    )
}
export default SelectOption
