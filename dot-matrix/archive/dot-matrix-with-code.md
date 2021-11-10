---
title: Building a Dot Matrix Animator
published: false
description: 
tags: showdev, ruby, programming
cover_image: https://i.imgur.com/cIJCDcv.png
---

<!-- ![](https://i.imgur.com/cIJCDcv.png) -->

Whenever I start learning a new skill, I like to come up with a project I can use to apply the skill, test my knowledge, and possibly find areas where I need to learn more. As helpful as tutorials and walkthroughs are, I find that I always get the most experience when I can struggle through a project I start from scratch and apply the knowledge I've learned without explicit instructions. I decided to write about my first Ruby project because I really enjoyed this project and think the results are pretty cool!

<!-- When I started to learn Ruby, I wanted to come up with a project I could use to practice the syntax. As helpful as tutorials and walkthroughs are, I find that I always get the most experience when I can struggle through a project I start from scratch and apply the knowledge I've learned on my own. Coming with experience in JavaScript and Python, I didn't mind getting a little ambitious with my first project in Ruby. -->

## The Idea

The idea I came up with was to write a program that creates a dot matrix animation based on input images. Here were my goals for the project:

- The user can provide any number of images for the animation
    - Each image acts as a [keyframe](https://en.wikipedia.org/wiki/Key_frame) in the animation
- The user can specify the size of the dot matrix (rows, columns, and dot size)
- The user can specify how long each keyframe is displayed, as well as how long the transition between keyframes lasts
- The user will receive an animation based on the inputs where dots are rendered on each frame with a size that relates to the pixel's color

For the purpose of having a set of images to start with, I made some simple, bitonal, vector images of my initials. I will be using these three images as the keyframes for my test animation.

![My initials as keyframes](https://i.imgur.com/6WDhHC0.png)

## The Implementation

Before writing the code, I wanted to come up with a plan so I could determine which tools I should implement. Here's what I came up with:

- Process the input images
    - Reduce the image size down to the dot matrix size so one pixel is represented by one dot (processing a full-size image would take longer, use more memory, and provide no benefit)
    - For each pixel in the image, determine the size a dot would need to be to represent it
- Interpolate between keyframes so the dots' sizes transition smoothly
-  Generate frames of the GIF animation
    - Render a dot for each pixel with a size based on the pixel's color
- Save the final GIF file

#### Processing the Input Images

To accomplish this project, I knew I would need some way to process the images. Resizing the input images was the easy bit. The more complex (and more important) task was to find the best way to relate a pixel's color in the source image to a dot's size in final animation. I felt that the relative luminance as described [in this W3 accessibility document](https://www.w3.org/TR/WCAG/#dfn-relative-luminance) was a logical property to use in this case, and can be easily calculated with a color's RGB components. After determining what tasks I needed to fulfill, I determined that the [RMagick library](https://rmagick.github.io/) would be a good choice for this project.



#### Rendering a GIF

Since I already decided to use RMagick to process the images, it makes sense to continue using it to generate a new GIF file for the animation as well. Luckily most of the process is pretty straightforward:

- Create an instance of the `ImageList` class (a class defined in the RMagick library) to hold each frame of the animation
- For each frame:
    - Create an instance of the `Image` class (also from RMagick)
    - Provide a background color
    - For each pixel/dot:
        - Draw a circle in the corresponding location with a radius determined by the relative luminance
    - Add the `Image` instance to the `ImageList`
    - Provide a duration for how long the `Image` just added should last (this allows us to pause longer on a keyframe compared to the transitional/animation frames)
- Save the `ImageList` instance to a `.gif` file

The more challenging piece is the transition between keyframes. To do this, I decided to write a method that would generate a new, weighted average image between two keyframes. As time progresses, the weight will shift towards the end keyframe to allow me to interpolate and generate a frame at any point in time. This new image can then be processed just like the keyframes. Below is an image demonstrating what I need to accomplish: any transitional frame between the two keyframes needs to be able to be generated to achieve a smooth transition. 

![Transitioning between two keyframes](https://i.imgur.com/905DSal.png)



## The Classes

With a library selected and a plan set, I had to determine how to actually write the program. Leaning more towards an object-oriented approach, I decided I wanted to use three classes:

- An `Animation` class that holds most of the information/logic for the animation as a whole
- A `Frame` class that holds the data for a single image in the animation
- A `Dot` class that holds the information for a single dot/pixel in an image

These classes are still in flux as I continue to develop and refactor so I won't be covering the code in this blog post, but feel free to check out my [repository on GitHub](https://github.com/fitzgeraldkd/dot-matrix) if you want to look into this more!

<!-- I'll go through some of the most important methods I wrote in each class, but I'll also include links to each Ruby file in case you want to see the full code for each class. -->

<!-- ### The `Dot` Class

The `Dot` class needs a few inputs when instantiating: the color of the pixel in the source image, as well as the `x` and `y` coordinates of the pixel. In addition to storing these pieces of data, a couple methods are needed to calculate other properties. Our goal was to provide the *relative luminance* as described above, but to do that we first need to calculate the RGB values in sRGB color space. Here are the two instance methods I used to make these calculations:

```ruby
def s_rgb(value)
  value = value.to_f / 65535
  value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
end

def relative_luminance
  r = s_rgb(@pixel.red)
  g = s_rgb(@pixel.green)
  b = s_rgb(@pixel.blue)
  (0.2126 * r + 0.7152 * g + 0.0722 * b).round(2)
end
```

The instance variable, `@pixel`, holds the instance of RMagick's `Pixel` class that represents this pixel. It already has the red, green, and blue components of the color accessible, so it's easy to take those components and run the necessary calculations! 

[Click here](https://github.com/fitzgeraldkd/dot-matrix/blob/main/lib/dot.rb) to see the full code for this class. -->

<!-- ### The `Frame` Class

Instances of this class will be instantiated with an image file that the frame is meant to represent. The most important method in this class is `#render`, which will create a dot matrix image from the source image. Here's what that method looks like: -->

<!-- The `Frame` class needs a single input: just an image. Instances of this class will also hold an array of all the related `Dot` instances. A method is also needed to iterate through each pixel in the source image, create an instance of the `Dot` class for each pixel, and store the instances. I also wrote a helper method to get a pixel at a specific set of coordinates in the image. Here are the methods I wrote:

```ruby
def process_image
  (0..@image.columns-1).each do |x|
    (0..@image.rows-1).each do |y|
      @pixels << Dot.new(get_pixel(x, y), x, y)
    end
  end
end

def get_pixel(x, y)
  @image.pixel_color(x, y)
end
```

The instance variable, `@image`, is the instance of image itself using RMagick's `ImageList` class. The `@pixels` instance variable is an array of all the pixels in the image. Each element in this array is an instance of the `Dot` class described above. -->

<!-- I also need the means to take a single frame and render a dot matrix image from the source image. Here's how we can do that: -->

<!-- ```ruby
def render(pixel_size, bg_color, fg_color, dot_size)
  image = Image.new(@image.columns * pixel_size, @image.rows * pixel_size) {
    self.background_color = bg_color
  }
  gc = Draw.new
  gc.fill(fg_color)
  process_image
  @pixels.each do |pixel|
    origin_x = (pixel.x + 0.5) * pixel_size
    origin_y = (pixel.y + 0.5) * pixel_size
    radius = (pixel_size / 2) * dot_size.call(pixel.relative_luminance)
    gc.circle(origin_x, origin_y, origin_x + radius, origin_y)
  end
  gc.draw(image)
  image
end
```

I start by creating a new image using the `Image` class from RMagick. I give it a size, and set the background color. Then to be able to draw on this image, I need to make a new instance of RMagick's `Draw` class. I can then set the fill color, iterate through all of the pixels, and create a dot for each pixel on the new image. At the end of the method I return the image so I can use it in `Animation` instances. I am passing in an argument for the `dot_size` parameter. This argument is a lambda function providing some flexibility in how the dot sizes are determined and can be set by the user when instantiating an `Animation`. Here is the default value:

```ruby
# default dot_size value passed into the #render method
dot_size = -> (lum) { (1 - lum) ** 2 }
```

By default it is calculated by `(1-lum)^2` (where `lum` is the pixel's relative luminance). These are my preferred settings from what I've tested so far, but a lambda function provides additional flexibility!

[Click here](https://github.com/fitzgeraldkd/dot-matrix/blob/main/lib/frame.rb) to see the full code for this class. -->

<!-- ### The `Animation` Class

This class is the most complex of the three. To create an instance the `Animation` class will need a few inputs: the number of columns and rows in the dot matrix, the background and foreground colors, and the framerate for the GIF.  -->
<!-- There are also a few methods I wrote to get all the necessary functionality. -->

<!-- The first method I wrote allowed me to add images to the animation and store into the instance variable, `@keyframes`. Here are what the method looks like:

```ruby
def add_keyframe(image)
  @keyframes << Frame.new(ImageList.new(image).resize(@columns, @rows))
end
``` -->

<!-- Next I wanted to figure out how to interpolate between keyframes to provide a smooth transition.  -->
<!-- The main challenge was figuring out how to interpolate between keyframes to provide a smooth transition.
To accomplish this, I wrote a method that accepts a starting frame, an ending frame, and an amount of time to transition between frames. Depending on the frames per second (`@fps`) the user determined, this method will fill in the gaps between the two frames. It creates an array of images, with each image being a weighted average between the start and end. This

```ruby
def average_colors(color_start, color_end, weight=0.5)
  {
    red: color_start.red * (1 - weight) + color_end.red * weight,
    green: color_start.green * (1 - weight) + color_end.green * weight,
    blue: color_start.blue * (1 - weight) + color_end.blue * weight
  }
end

def interpolate_frames(frame_start, frame_end, transition_time)
  current_time = 0.0
  frame_duration = 100.0 / @fps
  frames = []
  while current_time < transition_time * 100
    frame = Image.new(@columns, @rows)
    (0..@columns-1).each do |x|
      (0..@rows-1).each do |y|
        pixel_start = frame_start.get_pixel(x, y)
        pixel_end = frame_end.get_pixel(x, y)
        weight = current_time / (transition_time * 100)
        new_color = average_colors(pixel_start, pixel_end, weight)
        pixel = Pixel.new(new_color[:red], new_color[:green], new_color[:blue])
        frame.pixel_color(x, y, pixel)
      end
    end
    frames << frame
    current_time += frame_duration
  end
  frames
end
```

And finally, I needed to write a method that actually renders a GIF file! 

```ruby
def render_gif(pixel_size, hold_time, transition_time)
  gif = ImageList.new
  gif.ticks_per_second = 60
  @keyframes.each_with_index do |keyframe, index|
    next_index = index == @keyframes.length - 1 ? 0 : index + 1
    gif.push(keyframe.render(pixel_size, @bg_color, @fg_color))
    gif.cur_image.delay = 100.0 * hold_time

    transition_frames = interpolate_frames(keyframe, @keyframes[next_index], transition_time)
    transition_frames.each do |image|
      frame = Frame.new(image)
      gif << frame.render(pixel_size, @bg_color, @fg_color)
      gif.cur_image.delay = 100.0 / @fps
    end
  end
  filename = DateTime.now.strftime("%Y%m%d%H%M%S")
  gif.write("./output/#{filename}.gif")
end
```

[Click here](https://github.com/fitzgeraldkd/dot-matrix/blob/main/lib/animation.rb) to see the full code for this class. -->

## The Interface

I wanted to provide a command-line interface for the user that was easy to use, but I also wanted to provide the flexibility with the options used to render the animation. After looking around online I found that [Thor](https://github.com/rails/thor) was a good tool to utilize. It allowed me to easily create a number of options that make this program much more versatile. An example below shows how a user can select which folder the source images are in, as well as what the background and foreground colors should be:

```bash
bin/run render_gif --subfolder=demo --bg_color=black --fg_color=red
```

There are more options than that as well, and a default value is provided for each one.

## The Results

I'm really proud of the results! I was able to get the program to do exactly what I was looking for, and I enjoy seeing the animation. For the first example, here are three images I used as keyframes: one image for each of my initials.

<!-- ![](./images/k-logo.png)
![](./images/d-logo.png) -->
![My initials as keyframes](https://i.imgur.com/6WDhHC0.png)

After using these images in the script, here is the animation I got:

![Dot matrix animation of my initials](https://i.imgur.com/zEfihJk.gif)

Awesome! After seeing the results for a very simple bitonal image, I wanted to see how it looked for more complex examples. I decided to generate a static dot matrix with a width of 100 pixels for these examples. I used [this photo of the Eiffel Tower](https://unsplash.com/photos/MGDIKg9Bw5U) by Lisa BR on Unsplash and ran my script to see some nice results: 

![Dot matrix of a photo of Paris](https://i.imgur.com/mV3w35E.png)

I also tried it out on [this photo of a dog and a pumpkin](https://unsplash.com/photos/3v9CFkIKw_c) by Nathan Guzman on Unsplash and saw similarly promising results:

![Dot matrix of a photo of a dog and a pumpkin](https://i.imgur.com/HrvseLH.png)

Obviously a lot of detail was lost since the original pictures were almost 2000 pixels in width each and were being reduced to 100 pixels (also all color is removed), but the pictures are still definitely recognizeable! The object next to the dog in the last image may not be readable as a pumpkin, but other than that both images still retain enough detail to be made sense of.

## The Future

Here's a few things I'd like to add in the future:

- Have the foreground/background colors be dynamically set by the dominant colors in the source image
- Provide the option to transition colors between each keyframe
- Provide the option to generate an SVG instead of (or in addition to) a GIF
- Allow an animated GIF to be an input image (it currently reads the GIF as a single frame)
<!-- https://unsplash.com/photos/MGDIKg9Bw5U -->
<!-- https://unsplash.com/photos/3v9CFkIKw_c -->

## The Conclusion

I hope you found this project as interesting as I did! I had a lot of fun making it and feel a lot more comfortable with Ruby's syntax after going through it. *Thanks for reading!*