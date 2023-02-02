import React from "react";
import SvgIcon from "@mui/material/SvgIcon";
import {alpha, styled} from "@mui/material/styles";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';

const StyledTreeItem = styled((props) => (
    <TreeItem {...props} />
))(({ theme }) => ({
    [`& .${treeItemClasses.content}`]: {
        paddingTop: 8,
        paddingBottom: 8,
    },
    [`& .${treeItemClasses.iconContainer}`]: {
        marginLeft: 10,
        marginRight: 10,
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 25,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },

}));
export default function LinkTree({links}) {

    const mapLinks = function(links) {
        return links.map(({id, english_name, children}) => children === null
            ? <StyledTreeItem
                key={id}
                label={english_name}
                nodeId={id.toString()}
            />
            : <StyledTreeItem
                key={id}
                label={english_name}
                nodeId={id.toString()}
            >
                { mapLinks(children) }
            </StyledTreeItem>
        );
    }
    return (
        <TreeView
            onNodeSelect={(e, nodeId) => console.log('select', nodeId)}
            onNodeToggle={(e, nodeIds) => console.log('toggle', nodeIds)}
            aria-label="customized"
            defaultExpanded={[]}
            // defaultSelected
            defaultCollapseIcon={<KeyboardArrowDown />}
            defaultExpandIcon={<KeyboardArrowRight />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            { mapLinks(links) }
        </TreeView>
    )
}
