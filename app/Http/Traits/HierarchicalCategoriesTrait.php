<?php

namespace App\Http\Traits;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

trait HierarchicalCategoriesTrait {
    /**
     * Arrange the categories in hierarchical order.
     *
     * @return AnonymousResourceCollection
     */
    protected function categoryTree() {
        $categories = Category::all();
        $grouped =  $categories->groupBy('parent_id');
        $roots = $grouped[''];

        foreach ($roots as $node) {
            $node->children = $this->getChildren($grouped, $node->id);
            $node->level = 0;
        }

        return CategoryResource::collection($roots);
    }
    /**
     * Helper for categoryTree().
     *
     * @param Collection $grouped
     * @param int $id
     * @param int $level
     * @return AnonymousResourceCollection
     */
    protected function getChildren(Collection $grouped, int $id, int $level = 0) {
        if (! isset($grouped[$id])) {
            return null;
        }
        foreach ($grouped[$id] as $item) {
            $item->children = $this->getChildren($grouped, $item->id, $level+1);
            $item->level = $level+1;
        }
        return CategoryResource::collection($grouped[$id]);
    }
}
