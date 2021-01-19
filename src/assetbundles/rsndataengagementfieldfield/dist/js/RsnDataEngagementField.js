/**
 * RSN Data Engagement plugin for Craft CMS
 *
 * RsnDataEngagementField Field JS
 *
 * @author    Percipio Global Ltd
 * @copyright Copyright (c) 2020 Percipio Global Ltd
 * @link      https://percipio.london
 * @package   RsnDataEngagement
 * @since     1.0.0RsnDataEngagementRsnDataEngagementField
 */

(function($, window, document, undefined) {
    var pluginName = "RsnDataEngagementRsnDataEngagementField",
        defaults = {};

    // Plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function(id) {
            var _this = this;

            $(function() {
                /* -- _this.options gives us access to the $jsonVars that our FieldType passed down to us */

                const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

                const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
                )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

                // do the work...
                document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
                    const table = th.closest('table#fields-dataEngagementdata');
                    const tbody = table.querySelector('tbody');
                    Array.from(tbody.querySelectorAll('tr'))
                        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
                        .forEach(tr => tbody.appendChild(tr));
                })));

                // Tab handler
                $(".rsndata-tab-links").on("click", function(e) {
                    e.preventDefault();
                    $(".rsndata-tab-links").removeClass("sel");
                    $(this).addClass("sel");
                    $(".rsndata-tab-content").addClass("hidden");
                    var selector = $(this).attr("href");
                    $(selector).removeClass("hidden");
                    // Trigger a resize to make event handlers in Garnish activate
                    Garnish.$win.trigger("resize");
                    // Fixes Redactor fixed toolbars on previously hidden panes
                    Garnish.$doc.trigger("scroll");
                });

                // Tab handler
                $(".rsndata-tab-btn").on("click", function(e) {
                    e.preventDefault();
                    $(".rsndata-tab-links").removeClass("sel");
                    var tabSelector = $(this).attr("data-tab");
                    $("a#" + tabSelector).addClass("sel");
                    console.log("a#" + tabSelector);
                    var selector = $(this).attr("href");
                    $(".rsndata-tab-content").addClass("hidden");
                    var selector = $(this).attr("href");
                    $(selector).removeClass("hidden");
                    // Trigger a resize to make event handlers in Garnish activate
                    Garnish.$win.trigger("resize");
                    // Fixes Redactor fixed toolbars on previously hidden panes
                    Garnish.$doc.trigger("scroll");
                });

                // expand, contract the side panel function
                $(".rsn-toggle").on("click", function(e) {
                    e.preventDefault();
                    if ($(this).hasClass("expand")) {
                        $(this).removeClass("expand").addClass("collapse submit").text("Collapse");
                        $("#details-container").hide();
                        $("#content-container").css({
                            "width": "100%",
                            "max-width": "100%"
                        });

                    } else {
                        $(this).removeClass("collapse submit").addClass("expand").text("Expand");
                        $("#details-container").show();
                        $("#content-container").css({
                            "width": "calc(100% - 350px - 14px)",
                            "max-width": "calc(100% - 350px - 14px)"
                        });
                    }
                });
                // end expand function

                // dirty colour the status function
                $('.rsn-status').each(function() {
                    console.log();
                    if ($(this).find('textarea').val() == 1) {
                        $(this).addClass("success");
                    }
                    if ($(this).find('textarea').val() == 2) {
                        $(this).addClass("disabled");
                    }
                });




                var rsnClickFunction = function() {

                    // trigger the autocomplete only after target is clicked
                    $('.rsn-autocomplete textarea').click(function() {
                        rsnAutocomplete(this);
                    });

                    // autocomplete function
                    var rsnAutocomplete = function(el) {

                        if (el) {
                            var $trow = $(el).closest('tr'),
                                status = $trow.find('.rsn-status'),
                                statusVal = $trow.find('.rsn-status textarea'),
                                school = el,
                                schooldata = $trow.find('.rsn-data textarea'),
                                postcode = $trow.find('.rsn-postcode textarea'),
                                role = $trow.find('.rsn-role select');
                            $(status).addClass("pending");
                            $(school).attr('placeholder', 'Start typing...');
                            // fire the lookup launcher
                            rsnDataLaunch({
                                row: $trow,
                                status: status,
                                statusVal: statusVal,
                                school: school,
                                schooldata: schooldata,
                                postcode: postcode,
                                role: role,
                            });
                        }



                    };
                };

                // lookup launcher
                var rsnDataLaunch = function(row) {
                    // console.log(row);
                    var rowSelector = $(row.school).attr('name');

                    $(row.school).devbridgeAutocomplete({
                        deferRequestBy: 150,
                        minChars: 1,
                        type: 'GET',
                        serviceUrl: 'https://api.v2.metaseed.io/schools/?mode=legacy',
                        dataType: 'json',
                        onSearchStart: function(query) {
                            // console.log(query);
                            $(row.status).removeClass('pending').addClass("active");
                        },
                        onSearchComplete: function(query) {
                            // console.log(query);
                            //  $formPreloader.fadeOut('slow')
                        },
                        onSearchError: function(query, jqXHR, textStatus, errorThrown) {
                            // console.log(query, jqXHR, textStatus, errorThrown);
                            //  $formPreloader.fadeOut('slow');
                        },
                        onSelect: function(suggestion) {
                            //  console.log(suggestion);
                            // console.log(suggestion);
                            var isSchool = true;
                            if (suggestion.data === null) {
                                isSchool = false;
                            }
                            if (isSchool) {
                                $(row.status).removeClass('pending').removeClass('active').removeClass('disabled').addClass('success');
                                $(row.statusVal).val('1');
                                $(row.postcode).val(suggestion.data.postcode);
                                $(row.schooldata).val(suggestion.data.urn);
                                $(row.role).val('').attr('selected', 'selected');
                            } else {
                                $(row.status).removeClass('pending').removeClass('active').removeClass('success').addClass('disabled');
                                $(row.statusVal).val('2');
                                $(row.schooldata).val('');
                                $(row.role).val('na').attr('selected', 'selected');
                            }
                        },
                        beforeRender: function(container, suggestions) {
                            //  console.log(suggestions.length);
                        },
                        formatResult: function(suggestion, currentValue) {

                            if (suggestion.data) {
                                var street = suggestion.data.street;
                                var town = suggestion.data.town;
                                var postcode = suggestion.data.postcode;
                                if (street) {
                                    street = street + ', '
                                }
                                if (town) {
                                    town = town + ', '
                                }
                                if (postcode) {
                                    postcode = postcode + '. '
                                }
                                $school_data = '<div><b>' + suggestion.value + '</b><p>[URN:<b>' + suggestion.data.urn + '</b>] ' + street + town + postcode + '<span>(Age ' + suggestion.data.ageFrom + ' - ' + suggestion.data.ageTo + ')</span></p></div>';
                            } else {
                                $school_data = '<div><b>' + currentValue + '</b> can\'t be found.</b><p>If you are not looking for a school click <b>\'' + currentValue + '\'</b> to select it as an organisation.</p>'
                                suggestion.value = currentValue;
                            }
                            return $school_data
                        }
                    })

                };

                // re-init on dom change
                $.initialize(".rsn-autocomplete", function() {
                        rsnClickFunction();
                        $('.rsn-autocomplete:last textarea').click(function(){
                            // safari focus hack
                            $(this).css('background', '#f3f7fc');
                        });
                    }, {
                        target: document.getElementById('fields-dataEngagementdata')
                    },

                );


            });
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);