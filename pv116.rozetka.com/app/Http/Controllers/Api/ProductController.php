<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * @OA\Get(
     *     tags={"Product"},
     *     path="/api/products",
     *     @OA\Response(response="200", description="List Products.")
     * )
     */
    public function getList()
    {
        $data = Product::with('category', 'images')->get();
        return response()->json($data)
            ->header('Content-Type', 'application/json; charset=utf-8');
    }

    /**
     * @OA\Post(
     *     tags={"Product"},
     *     path="/api/products",
     *     @OA\RequestBody(
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 required={"name", "description", "price", "quantity", "category_id", "images"},
     *                 @OA\Property(
     *                     property="name",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="description",
     *                     type="string"
     *                 ),
     *                 @OA\Property(
     *                     property="price",
     *                     type="number"
     *                 ),
     *                 @OA\Property(
     *                     property="quantity",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="category_id",
     *                     type="integer"
     *                 ),
     *                 @OA\Property(
     *                     property="images",
     *                     type="array",
     *                     @OA\Items(
     *                         type="file"
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(response="201", description="Product created.")
     * )
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
            'category_id' => 'required|integer',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $input = $request->all();

        // Create the product
        $product = Product::create([
            'name' => $input['name'],
            'description' => $input['description'],
            'price' => $input['price'],
            'quantity' => $input['quantity'],
            'category_id' => $input['category_id'],
        ]);

        // Upload and attach images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imageName = time() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('images'), $imageName);

                ProductImage::create([
                    'product_id' => $product->id,
                    'name' => $imageName,
                ]);
            }
        }

        return response()->json($product, 201, [
            'Content-Type' => 'application/json;charset=UTF-8',
            'Charset' => 'utf-8',
        ], JSON_UNESCAPED_UNICODE);
    }
}
