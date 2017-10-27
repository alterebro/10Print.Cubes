

var w = 500;
var h = 500;
var cubes = {
    w : 40,
    h : 30,
    c : "#9ac",
    f : 6,
    r : 0
}
var defaults = cubes;

function cube(x, y, w, h, f, c, a) {

    // x, y : self explanatory
    // w, h : width and height
    // f : perspective factor
    // c: color
    // a: concave or convex (true | false)

    var c_darker = new Rune.Color(c).darken(.5);
    var c_dark = new Rune.Color(c).darken(.25);
    var c_light = new Rune.Color(c).lighten(.25);

    if (a) {
        r.polygon(x, y)
            .lineTo(0, 0)
            .lineTo(w/2, -(h/f))
            .lineTo(w, 0)
            .lineTo(w/2, h/f)
            .fill(c_light).stroke(false);

        r.polygon(x, y)
            .lineTo(0, 0)
            .lineTo(w/2, h/f)
            .lineTo(w/2, h - (h/f))
            .lineTo(0, h - ((h/f)*2))
            .fill(c).stroke(false);

        r.polygon(x, y)
            .lineTo(w, 0)
            .lineTo(w, h - ((h/f)*2))
            .lineTo(w/2, h - (h/f))
            .lineTo(w/2, h/f)
            .fill(c_dark).stroke(false);
    } else {

        r.polygon(x, y)
            .lineTo(0, 0)
            .lineTo(w/2, -(h/f))
            .lineTo(w/2, h - (h/f)*3)
            .lineTo(0, h - ((h/f)*2))
            .fill(c_darker).stroke(false);

        r.polygon(x, y)
            .lineTo(w, 0)
            .lineTo(w, h - ((h/f)*2))
            .lineTo(w/2, h - (h/f)*3)
            .lineTo(w/2, -(h/f))
            .fill(c_dark).stroke(false);

        r.polygon(x, y)
            .lineTo(0, h - ((h/f)*2))
            .lineTo(w/2, h - (h/f)*3)
            .lineTo(w, h - ((h/f)*2))
            .lineTo(w/2, h - (h/f))
            .fill(c).stroke(false);
    }
}

function draw_cubes() {

    for ( var i = 0; i < Math.ceil(w/cubes.w) + 1; i++ ) {

        var _y = Math.ceil(h/cubes.h);
            _y = Math.ceil(_y + Math.round((_y/cubes.f)*2) );

        for (var j = 0; j < _y; j++) {

            var add = (j%2) ? (-(cubes.w/2)) : 0;
            var cnv = Math.round( Math.random() + cubes.r );

            cube(
                (cubes.w*i)+add,
                (cubes.h*j) - (cubes.h/cubes.f)*j,
                cubes.w, cubes.h, cubes.f, cubes.c, cnv
            );
        }
    }
}







var r;
var initialized = false;

window.onload = function() {

    // Create Containers
    var main = document.createElement('div');
        main.setAttribute('id', 'output-main');
        main.classList.add('output');

    var aux = document.createElement('div');
        aux.setAttribute('id', 'output-aux');
        aux.classList.add('output');
        aux.classList.add('hide');

    document.getElementById('output').appendChild(main)
    document.getElementById('output').appendChild(aux)


    function generate() {


        aux.innerHTML = main.innerHTML;
        aux.style.zIndex = 1;
        main.style.zIndex = 0;
        main.innerHTML = '';


        r = new Rune({
          container: "#output-main",
          width: w,
          height: h,
          debug: false
        });

        draw_cubes();
        r.draw();

        aux.classList.add('hide');

        window.setTimeout(function() {

            main.style.zIndex = 1;
            aux.style.zIndex = 0;
            aux.classList.remove('hide');

        }, 250);

    }

    generate();





    // UI Elements

    var els = {
        w : document.querySelector('#cubes-width'),
        h : document.querySelector('#cubes-height'),
        c : document.querySelector('#cubes-color'),
        f : document.querySelector('#cubes-factor'),
        r : document.querySelector('#cubes-ratio')
    }

    function data() {
        var data = {};
        for ( var i in els ) {
            data[i] = els[i].value;
        }
        return data;
    }

    for ( var i in els ) {
        els[i].onchange = function() {
            // console.log( data() );
            var d = data();
            cubes.w = d.w;
            cubes.h = d.h;
            cubes.c = d.c;
            cubes.f = d.f;
            cubes.r = (d.r - 0.5);

            generate();
        }
    }



    document.querySelector('#cubes-reset').onclick = function() {
        cubes = defaults;
        generate();
    }

    document.querySelector('#cubes-svg').onclick = function(e) {

        // e.preventDefault();

        // console.log(  );
        this.setAttribute('target', '_blank');
        this.href = "data:image/svg+xml;base64," + btoa(main.innerHTML);


    }




}
