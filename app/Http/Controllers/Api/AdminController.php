<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StaffResource;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        $staff = Staff::withTrashed()->orderBy($orderBy, $order)->paginate($perPage);
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
           'mobile_number' => 'nullable|string|required_if:email,null',
           'password' => 'required|confirmed|min:8'
        ]);

        return Staff::create([
           'name' => $validated['name'],
           'email' => $validated['email'],
           'mobile_number' => $validated['mobile_number'],
           'password' => Hash::make( $validated['password'] ),
        ]);
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
     * @param  int $staff
     * @return array
     */
    public function update(Request $request, $staff)
    {
        $record = Staff::withTrashed()->findOrFail($staff);
        $id = $record->id;

        if ( array_key_exists('is_active', $request->all()) ) {
            $validated = $request->validate([
                'is_active' => 'boolean'
            ]);

            if ( $validated['is_active'] ) {
                $record->restore();
                $action = 'activated';
            } else {
                $record->delete();
                $action = 'deactivated';
            }
        } else {
            $validated = $request->validate([
                'name' => 'required|min:5',
                'email' => 'nullable|email|required_if:mobile_number,null',
                'mobile_number' => 'nullable|numeric|required_if:email,null',
                'password' => 'required|confirmed|min:8'
            ]);

            $record->name = $validated['name'];
            $record->email = $validated['email'];
            $record->email = $validated['email'];
            $record->mobile_number = $validated['mobile_number'];
            $record->password = Hash::make($validated['password']);

            $record->save();

            $action = 'updated';
        }

        return [
            'action' => $action,
            'id' => $id,
        ];
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
