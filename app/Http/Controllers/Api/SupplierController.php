<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $perPage = $request->perPage ?? 10;
        $orderBy = $request->orderBy ?? 'id';
        $order = $request->order ?? 'asc';


        $suppliers = Supplier::orderBy($orderBy, $order)->paginate($perPage);
        $suppliers->appends(compact('perPage', 'orderBy', 'order'));

        return SupplierResource::collection($suppliers)->additional([
            'meta' => compact( 'orderBy', 'order' )
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $validated = $request->validate([
            'contact_name'             => 'required|string|max:50',
            'business_name'            => 'nullable|string|max:50',
            'address'                  => 'nullable|string|max:100',
            'email'                    => 'nullable|string|max:50',
            'primary_contact_number'   => 'required|string|max:20',
            'secondary_contact_number' => 'nullable|string|max:20',
            'status'                   => 'required|string|in:active,inactive'
        ]);

        return Supplier::create( $validated );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    // Non standard methods
    /**
     * Update the specified resource's status.
     *
     * @param Request $request
     * @return array
     */
    public function toggleActivation( Request $request ) {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
        ]);

        $active = Supplier::whereIn('id', $validated['ids'])
            ->where('status', 'active')->get();
        $activeKeys = $active->modelKeys();

        $inactive = Supplier::whereIn('id', $validated['ids'])
            ->where('status', 'inactive')->get();
        $inactiveKeys = $inactive->modelKeys();


        $countInactive = Supplier::whereIn('id', $activeKeys)->update(['status' => 'inactive']);
        $countActive = Supplier::whereIn('id', $inactiveKeys)->update(['status' => 'active']);

        $message = "$countActive activated, $countInactive deactivated.";

        return compact('countActive', 'countInactive', 'message');
    }
}
