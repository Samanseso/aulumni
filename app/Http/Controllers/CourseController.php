<?php

namespace App\Http\Controllers;

use App\Http\Requests\CourseRequest;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\View\View;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('department')
            ->orderBy('course_id', 'asc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('courses/Index', ['courses' => $courses]);
    }

    public function store(CourseRequest $request): RedirectResponse
    {
        Course::create($request->validated());
        return redirect()->route('courses.index')->with('success', 'Course created.');
    }

    public function update(CourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->validated());
        return redirect()->route('courses.index')->with('success', 'Course updated.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();
        return redirect()->route('courses.index')->with('success', 'Course deleted.');
    }
}
