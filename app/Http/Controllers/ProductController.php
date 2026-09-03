<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
class ProductController extends Controller
{
    public function index()
    {
        $products = Http::get('https://fakestoreapi.com/products')->json();

        return inertia('product/product', ['products' => $products]);
    }
    public function create()
    {
        return inertia('product/create', []);
    }

    public function apitest()
    {
        return $this->index();
    }

}
