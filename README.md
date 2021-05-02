<!-- Logo: start -->
<p align="center"><img src="/public/images/logo.svg" alt="FoodsViewer's logo" height="150" /></p>
<!-- Logo: end -->

# FoodsViewer

A private and secure front-end interface to the
[digest](https://github.com/jeanmathieupotvin/digest) package built for me and
my girlfriend.

# Description

FoodsViewer is a responsive web application to better visuzalize results stemming from Viome 
Gut Intelligence Test® kits. It uses the data structures of
[digest](https://github.com/jeanmathieupotvin/digest) to better combine results of a couple,
here mine. It is a **private** application. You cannot sign-up, and you cannot use it. This
is because I am not affiliated to Viome® in any way. For more information on this, see section
[Disclaimer](#Disclaimer) below.

# Why is this code public?

Because you can easily clone this project, deploy it and use it privately, just like I do. I
made my best to make it production ready. Note that you will have to go through the following
steps to do so.

1. Create a private, untracked `crypt/` folder. This folder will contain your users' information
and data (basically JSON files containing unparsed `digest::FoodCollection`.

2. Create a private, untracked `.env` file with some secret `SESSION_TOKEN`. Make it random, really
long, and **hide it** at all costs. You will also have a set a second environment variable
`NOD_ENV` and *eventually* set it equal to 'production'.

3. Compile the production versions of the CSS and JS scripts with the `npm` commands defined in
`package.json`.

4. Create a `private/images/` folder, and populate it with images of all the foods included in
your `digestL::FoodCollections`. Make sure that names passed to `Food::imgFile` match the names
of your foods' images.

5. Finally, publish to the web, in one click (anyone else tired of these annoying YouTube's *Webflow*
ads?).

# Implementation

This web application is an Express application embedded into a Node process. It uses

* EJS as its templating system;
* memorystore, bcrypt, and Passport for authentication, sessions and cookies;
* SASS to build CSS files;
* PostCSS to minify CSS files and
* UglifyJS to compress and minify client-side JS scripts.

The code is straightforward, follows usual Express conventions, and is well documented. It won't
be complicated to adapt it, I guarantee it. 😄🌈

# Disclaimer

I am not affiliated to Viome® in any way. FoodsViewer is an independent project.

No Viome® data is exposed by FoodsViewer. It assumes that each user builds its own application and its
own datasets manually, from their personal results.

Viome® and Viome Gut Intelligence Test® are registered trademarks. Buy your own kit online from their online store.

# Bugs and feedback

Submit them [here](https://github.com/jeanmathieupotvin/foodsviewer/issues). Thanks!
