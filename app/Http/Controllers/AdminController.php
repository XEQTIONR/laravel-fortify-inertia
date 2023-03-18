<?php

namespace App\Http\Controllers;

use App\Http\Resources\StaffResource;
use App\Models\Staff;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Api\AdminController as Controller;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Staff', [
            'staff' => parent::index($request),
        ]);
    }

    /**
     *
     * Show the form for creating a new resource.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/AddStaff');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $admin = parent::store($request);

        return redirect( route('admin.staff.index') )->with([
            'title' => 'New account created.',
            'message' => "Account for $admin->name was created.",
            'status' => \Illuminate\Http\Response::HTTP_CREATED,
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
     * Show the form for editing the specified resource.
     *
     * @param  int $staff
     * @return \Inertia\Response
     */
    public function edit($staff)
    {
        $record = Staff::withTrashed()->findOrFail($staff);

        return Inertia::render('Admin/EditStaff', [
            'staff' => new StaffResource($record),
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int $staff
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $staff)
    {
        $data = parent::update($request, $staff);
        $record = Staff::withTrashed()->findOrFail($staff);
        $name = $record->name;

        return redirect( route( 'admin.staff.index' ) )->with([
           'title' => "Staff {$data['id']} {$data['action']}",
           'message' => "{$name} as {$data['action']}.",
           'status' => \Illuminate\Http\Response::HTTP_OK,
        ]);
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
