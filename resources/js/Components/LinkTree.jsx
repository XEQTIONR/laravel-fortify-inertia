import { Inertia } from '@inertiajs/inertia';
import React, { useEffect, useState } from "react";
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
    [`& .${treeItemClasses.disabled}`]: {
        opacity: 1,
    },

}));

const flatten = function(cats) {
    if (cats.length === 0) {
        return cats;
    }
    if (cats[0].children === null) {
        return [cats[0], ...flatten(cats.slice(1))]
    }
    return [cats[0], ...flatten(cats[0].children), ...flatten(cats.slice(1))];
}

const ancestorIds = function(cat, nodeList) {
    if (cat.parent_id === null ) {
        return []
    }
    return [ cat.parent_id,
        ...ancestorIds( nodeList.find( ancestor => ancestor.id === cat.parent_id ),
            nodeList )
    ];
}

export default function LinkTree({links}) {

    const [ flattenedCategories, setFlattenedCategories ] = useState( flatten(links) )
    const [ expanded, setExpanded ] = useState([]);
    const [ selected, setSelected ] = useState(null);

    const mapLinks = function(theLinks) { // theLinks is the hierarchical list
        return theLinks.map((link) => link.children === null
            ? <StyledTreeItem // leaf node
                onClick={() => {
                    setSelected(link.id.toString());
                }}
                disabled={true}
                key={link.id}
                label={link.english_name}
                nodeId={link.id.toString()}
            />
            : <StyledTreeItem // non-leaf node
                onClick={() => {
                    setSelected(link.id.toString());
                    setExpanded([link.id, ...ancestorIds(link, flattenedCategories)].map(item => item.toString()))

                }}
                disabled={true}
                key={link.id}
                label={link.english_name}
                nodeId={link.id.toString()}
            >
                { mapLinks(link.children) }
            </StyledTreeItem>
        );
    }
    return (
        <TreeView
            aria-label="customized"
            defaultExpanded={[]}
            expanded={expanded}
            // defaultSelected
            selected={selected}
            defaultCollapseIcon={<KeyboardArrowDown />}
            defaultExpandIcon={<KeyboardArrowRight />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            { mapLinks(links) }
        </TreeView>
    )
}
