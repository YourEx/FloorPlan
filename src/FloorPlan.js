(function(){

    var HTML =
        [
            '<div class="flour-plan">',
                '<div class="flour-plan-img"></div>',
                '<div class="points"></div>',
            '</div>'
        ].join('');


    var FloorPlan = function (options) {
        this.options = options;
        this.$el = $(options.el);
        this.img = null;
        this.xScale = null;
        this.yScale = null;
    }

    $.extend(FloorPlan.prototype, {

        init: function (url) {
            this.options.url = url || this.options.url;
            this.$el.html(HTML);
            return this._loadImg().done(
                this._renderImgAndSetupScale.bind(this),
                this.refresh.bind(this));
        },

        refresh: function (data) {
            data = data || [];

            var self = this;
            var points = d3.select(this.$el.find('.flour-plan-img')[0])
                .selectAll('div').data(data, function (item) {
                    return item.id
                });
                
            var styles = {
                left: function (item) {
                    return self.xScale(item.x) + 'px';
                },

                top: function (item) {
                    return self.yScale(item.y) + 'px';
                }
            };

            // update
            points.transition()
                .style('left', styles.left)
                .style('top', styles.top);
                     
            // create
            points.enter()
                .append('div')
                .attr('class', 'point')
                .style(styles);
                     
            // delete
            points.exit()
                .transition()                     
                .style('width', '0px')
                .style('height', '0px')
                .remove();
        },
        
        _loadImg: function () {
            var dfd = $.Deferred();
            this.img = new Image();
            this.img.src = this.options.url;
            this.img.onload = function () {
                dfd.resolve();
            }
                
            return dfd.promise();
        },

        _renderImgAndSetupScale: function (dfd) {
            // get actual img size
            var domainX = this.img.width;
            var domainY = this.img.height;
            var $img = $(this.img);

            this.$el.find('.flour-plan-img').append(this.img);

            // get rendered img size
            var rangeX = $img.width();
            var rangeY = $img.height();

            // setup scale
            this.xScale = d3.scale.linear().range([0, rangeX]).domain([0, domainX]);
            this.yScale = d3.scale.linear().range([0, rangeY]).domain([0, domainY]);
        }
    });

    window.FloorPlan = FloorPlan;

})();