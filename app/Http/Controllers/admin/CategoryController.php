<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    // return all categories

    public function index() {
    $categories=Category::orderBy('created_at','Desc')->get();

    return response()->json([
        'status'=>200,
        'data'=>$categories
    ]);
    }


//store cateory data in database
public function store(Request $request){

    $validator=Validator::make($request->all(),[
        'name'=>'required'
    ]);

    if($validator->fails()){
        return response()->json([
            'status'=>400,
            'errors'=>$validator->errors()
        ],400);
    }
 $category=new Category();
 $category->name=$request->name;
 $category->status=$request->status;
 $category->save();

return response()->json([
    'status'=>200,
    'message'=>'category added successfully',
    'data'=>$category
],200);

}



//return single category

public function show($id){

$category=Category::find($id);

if($category==null){

    return response()->json([
        'status'=>404,
        'message'=>'category not found',
        'data'=>$category
    ],404);
}
return response()->json([
    'status'=>200,
    'data'=>$category
],200);
}




//update
public function update($id, Request $request)
{
    $category=Category::find($id);
    if($category==null){

        return response()->json([
            'status'=>404,
            'message'=>'category not found',
            'data'=>$category
        ],404);
    }
    $validator=Validator::make($request->all(),[
        'name'=>'required'
    ]);

    if($validator->fails()){
        return response()->json([
            'status'=>400,
            'errors'=>$validator->errors()
        ],400);
    }

 $category->name=$request->name;
 $category->status=$request->status;
 $category->save();

return response()->json([
    'status'=>200,
    'message'=>'category updated successfully',
    'data'=>$category
],200);

}



//destroy single category
public function destroy($id, Request $request){

    $category=Category::find($id);
    if($category==null){

        return response()->json([
            'status'=>404,
            'message'=>'category not found',
            'data'=>$category
        ],404);
    }
    $category->delete();
    
return response()->json([
    'status'=>200,
    'message'=>'category deleted  successfully',
],200);

}



    
}
