<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryItemRequest;
use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

class InventoryItemController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->inventoryItems()->orderBy('name', 'asc')->get();
    }

    public function store(InventoryItemRequest $request)
    {
        $item = $request->user()->inventoryItems()->create($request->all());

        return response()->json($item, 201);
    }

    public function show(InventoryItem $inventoryItem)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        return $inventoryItem;
    }

    public function update(InventoryItemRequest $request, InventoryItem $inventoryItem)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        $inventoryItem->update($request->all());

        return $inventoryItem;
    }

    public function destroy(InventoryItem $inventoryItem)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        $inventoryItem->delete();
    }

    public function showImage(InventoryItem $inventoryItem)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        $path = InventoryItem::$image_path_prefix . $inventoryItem->id;
        if (Storage::exists($path)) {
            return Storage::download($path);
        } else {
            return response('', 404);
        }
    }

    public function storeImage(InventoryItem $inventoryItem, Request $request)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        $request->validate([
            'image' => [File::image()->max(10 * 1024)],
        ]);
        $file = $request->file('image');

        $file->storeAs(InventoryItem::$image_path_prefix, $inventoryItem->id);
    }

    public function deleteImage(InventoryItem $inventoryItem)
    {
        Gate::authorize('access-inventory-item', $inventoryItem);

        $path = InventoryItem::$image_path_prefix . $inventoryItem->id;
        if (Storage::exists($path)) {
            Storage::delete($path);
        }
    }
}
