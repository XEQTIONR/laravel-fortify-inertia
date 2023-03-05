<?php

namespace App\Http\Controllers;

use App\Contracts\HierarchicalCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SecurityController extends Controller
{
    protected static array $fields = [
        'Full name' => 'name',
        'Email' => 'email',
        'Password' => 'password',
        'Mobile number' => 'primary_contact_number',
        'Other contact number' => 'secondary_contact_number',
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Security', [
            'categories' => app(HierarchicalCategories::class)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * @return \Inertia\Response
     */
    public function edit(Request $request)
    {
        $validated = $request->validate([
           'field' => [
               'required',
               Rule::in(array_values(self::$fields)),
           ]
        ]);

        return Inertia::render('EditUser', [
            'categories' => app(HierarchicalCategories::class),
            'field' => $validated['field'],
            'label' => array_search($validated['field'], self::$fields)
        ]);
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
