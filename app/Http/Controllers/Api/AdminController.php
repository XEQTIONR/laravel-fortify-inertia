<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffResource;
use App\Models\Staff;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index(Request $request)
    {
        $perPage = $request->perPage ?? 10;
        $orderBy = $request->orderBy ?? 'id';
        $order = $request->order ?? 'asc';

        $staff = Staff::orderBy($orderBy, $order)->paginate($perPage);
        $staff->appends(compact('perPage', 'orderBy', 'order'));

        return StaffResource::collection($staff)->additional([
           'meta' => compact( 'orderBy', 'order' ),
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
        $validated = $request->validate([
           'name' => 'required|min:5',
           'email' => 'nullable|email|required_if:mobile_number,null',
           'mobile_number' => 'nullable|numeric|required_if:email,null',
           'password' => 'required|confirmed|min:8'
        ]);

        return $validated;
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
}
