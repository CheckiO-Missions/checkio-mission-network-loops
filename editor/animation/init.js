//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210', 'snap.svg_030'],
    function (ext, $, Raphael, Snap) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide = {};
            cur_slide["in"] = data[0];
            this_e.addAnimationSlide(cur_slide);
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            //YOUR FUNCTION NAME
            var fname = 'find_cycle';

            var checkioInput = data.in || [[1, 2], [2, 3], [3, 4], [4, 5], [5, 7], [7, 6], [8, 5], [8, 4], [1, 5], [2, 4]];
            var checkioInputStr = fname + '(' + JSON.stringify(checkioInput).replace(/\[/g, "(").replace(/]/g, ")") + ')';

            var failError = function (dError) {
                $content.find('.call').html(checkioInputStr);
                $content.find('.output').html(dError.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
            };

            if (data.error) {
                failError(data.error);
                return false;
            }

            if (data.ext && data.ext.inspector_fail) {
                failError(data.ext.inspector_result_addon);
                return false;
            }

            $content.find('.call').html(checkioInputStr);
            $content.find('.output').html('Working...');


            if (data.ext) {
                var rightResult = data.ext["answer"];
                var userResult = data.out;
                var result = data.ext["result"];
                var resultText = data.ext["result_addon"];
                var vertexes = data.ext["vertexes"];

                var svg = new SVG($content.find(".explanation")[0]);
                svg.draw(vertexes, checkioInput);

                $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));
                if (!result) {
                    $content.find('.answer').html(resultText);
                    $content.find('.answer').addClass('error');
                    $content.find('.output').addClass('error');
                    $content.find('.call').addClass('error');
                }
                else {
                    $content.find('.answer').remove();
                }
            }
            else {
                $content.find('.answer').remove();
            }


            //Your code here about test explanation animation
            //$content.find(".explanation").html("Something text for example");
            //
            //
            //
            //
            //


            this_e.setAnimationHeight($content.height() + 60);

        });

        //This is for Tryit (but not necessary)
//        var $tryit;
//        ext.set_console_process_ret(function (this_e, ret) {
//            $tryit.find(".checkio-result").html("Result<br>" + ret);
//        });
//
//        ext.set_generate_animation_panel(function (this_e) {
//            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit'))).find('.tryit-content');
//            $tryit.find('.bn-check').click(function (e) {
//                e.preventDefault();
//                this_e.sendToConsoleCheckiO("something");
//            });
//        });


        function SVG(dom) {
            var colorOrange4 = "#a83901";
            var colorOrange3 = "#ca4701";
            var colorOrange2 = "#fa5e09";
            var colorOrange1 = "#Ff935b";

            var colorBlue4 = "#115d81";
            var colorBlue3 = "#2b95c5";
            var colorBlue2 = "#9ad0ec";
            var colorBlue1 = "#dceaf1";

            var colorGrey4 = "#000000";
            var colorGrey3 = "#373737";
            var colorGrey2 = "#7e7e7e";
            var colorGrey1 = "#cecece";

            var colorWhite = "#FFFFFF";


            var R = 160;
            var r = 15;

            var pad = 10;

            var size = 2 * pad + 2 * (R + r);

            var center = size / 2;

            var paper = Raphael(dom, size, size);

            var networkObjects = {};

            var attrCircle = {"stroke": colorBlue4, "stroke-width": 2, "fill": colorBlue1};
            var attrName = {"font-family": "Roboto, Arial, sans-serif", "font-size": r * 1.5};
            var attrLine = {"stroke": colorBlue4, "stroke-width": 3};

            this.draw = function (n, connections) {
                var angle = Math.PI * 2 / n;

                var circles = [];

                for (var i = 0; i < n; i++) {
                    var x = center - Math.cos(i * angle + Math.PI / 2) * R;
                    var y = center - Math.sin(i * angle + Math.PI / 2) * R;
                    paper.circle(x, y, r).attr(attrCircle);
                    paper.text(x, y, i + 1).attr(attrName);
                    circles.push([x, y]);
                }
                for (i = 0; i < connections.length; i++) {
                    var fr = connections[i][0];
                    var to = connections[i][1];
                    paper.path(
                        Raphael.format("M{0},{1}L{2},{3}",
                            circles[fr-1][0],
                            circles[fr-1][1],
                            circles[to-1][0],
                            circles[to-1][1])).attr(attrLine).toBack();

                }
            }

        }


        //Your Additional functions or objects inside scope
        //
        //
        //


    }
);
