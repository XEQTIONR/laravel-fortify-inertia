import React, { useEffect, useState } from "react";
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react'
import {alpha, styled} from "@mui/material/styles";
import TreeItem, {treeItemClasses} from "@mui/lab/TreeItem";
import TreeView from "@mui/lab/TreeView";
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import flatten from "@/functions/flatten";

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
        opacity: .65,
    },
    [`& .${treeItemClasses.expanded}`]: {
        opacity: 1,
    },
    [`& .${treeItemClasses.expanded} .${treeItemClasses.label}`]: {
        //fontWeight: 'bold',
        color: theme.palette.primary.main
    },
    [`& .${treeItemClasses.selected} .${treeItemClasses.label}`]: {
        fontWeight: 'bold',
    },
    [`& :hover`]: {
        fontWeight: 'bold',
    },

}));

const ancestorIds = function(cat, nodeList) {
    if (cat.parent_id === null ) {
        return []
    }
    return [ cat.parent_id,
        ...ancestorIds( nodeList.find( ancestor => ancestor.id === cat.parent_id ),
            nodeList )
    ];
}

export default function LinkTree({links, selectedCategory, onSelect}) {

    const { locale } = usePage().props;

    const [ flattenedCategories, setFlattenedCategories ] = useState( flatten(links) )
    const [ expanded, setExpanded ] = useState([]);
    const [ selected, setSelected ] = useState(null);

    function name(category) {
        switch(locale) {
            case 'en':
                return category.english_name;
            case 'bn':
                return category.bangla_name;
            default:
                return category.english_name;
        }
    }

    useEffect(() => {
        if (selectedCategory !== null) {
            const aIds = ancestorIds(selectedCategory, flattenedCategories);
            if (selectedCategory.children !== null) {
                setExpanded([...aIds.map(value => value.toString())])
            } else {
                setExpanded([selectedCategory.id.toString(), ...aIds.map(value => value.toString())])
            }
            setSelected(selectedCategory.id.toString());
        }
    },[selectedCategory]);

    const mapLinks = function(theLinks) { // theLinks is the hierarchical list
        return theLinks.map((link) => link.children === null
            ? <StyledTreeItem // leaf node
                onClick={() => {
                    onSelect()
                    Inertia.visit(route('welcome', { slug: link.slug }), {
                        preserveState: true
                    })
                }}
                disabled
                key={link.id}
                label={name(link)}
                nodeId={link.id.toString()}
            />
            : <StyledTreeItem // non-leaf node
                onClick={() => {
                    onSelect()
                    Inertia.visit(route('welcome', { slug: link.slug }),{
                        preserveState: true
                    })
                }}
                disabled
                key={link.id}
                label={name(link)}
                nodeId={link.id.toString()}
            >
                { mapLinks(link.children) }
            </StyledTreeItem>
        );
    }
    return (
        <TreeView
            color="secondary"
            aria-label="customized"
            expanded={expanded}
            selected={selected}
            defaultCollapseIcon={<KeyboardArrowDown />}
            defaultExpandIcon={<KeyboardArrowRight />}
            sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
            { mapLinks(links) }
        </TreeView>
    )
}
