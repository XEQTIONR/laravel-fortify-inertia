<?php

namespace App\Http\Traits;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

trait HierarchicalCategoriesTrait {
    protected function categoryTree() {
        $categories = Category::all();
        $grouped =  $categories->groupBy('parent_id');
        $roots = $grouped[''];

        foreach ($roots as $node) {
            $node->children = $this->getChildren($grouped, $node->id);
            $node->level = 0;
        }

        return $roots;
    }
    /**
     * Arrange the categories in hierarchical order.
     *
     * @param Collection $grouped
     * @param int $id
     * @param int $level
     * @return array
     */
    protected function getChildren(Collection $grouped, int $id, int $level = 0) {
        if (! isset($grouped[$id])) {
            return null;
        }
        foreach ($grouped[$id] as $item) {
            $item->children = $this->getChildren($grouped, $item->id, $level+1);
            $item->level = $level+1;
        }
        return $grouped[$id];
    }
}
