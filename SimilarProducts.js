  <style>
    .js-similar-products{display: none;}
  </style>
  <div class="js-similar-products primary-inner">
    <div class="similar-products-inner container">
      <div class="block-header is-small">
        <div class="view_more">Смотрите еще</div>
      </div>
      <div class="row js-product-inset">
      </div>
    </div>
  </div><!-- /.similar-products -->



  <script>
    SimilarProducts = (function(){

     var SimilarProducts = function(config) {

      this.el = {
        container: jQuery('.js-similar-products'),
        products:  jQuery('.js-product-inset'),
        property:  'data-property-handle',
        char:      'data-char-id',
        price:      jQuery('[data-product-price]'),
        collection :jQuery('.breadcrumb-item:last').prev()
      }  
      
      this.config = config
      
      if ( this.config.el ) { 
        this.el = this.config.el
      }

      this.init()
    }

    SimilarProducts.prototype.render = function(link){

      var self = this;

      var template = function( product ){ 
        return '<div class="product-card similar-product cell-xl-3 cell-lg-4 cell-sm-6 cell-xs-12">' + product + '</div>'
      }

      jQuery.get(link)
      .done(function(e){
        $('.products-list .product-card', $.parseHTML(e))
        .each(function(){
          self.el.products.prepend($(this)) 
        })

        var CardsLength = self.el.products.find('.product-card').length 

        if ( self.config['Колличество'] && CardsLength > self.config['Колличество'] ) {
         self.el
         .products
         .find('.product-card:gt(' + (self.config['Колличество'] - 1) + ')')
         .remove()
       }

       self.el.products.find('.product-card').each(function(){

        var product_id = jQuery(this).find('[data-product-id]').data('product-id')

        if ( product_id == $('[data-main-id]').data('main-id') ) {
         jQuery(this).remove()
       }
     })

       if (CardsLength > 0) {
        self.el.container.show()
      }

      if ( self.el.products.find('.product-card').length == 0 ) {
        self.el.container.hide()
      }
    })
      .fail(function(){
      	self.el.container.hide()
      })
    }

    SimilarProducts.prototype.link = function(chars){
    	
     var self = this

     var price = parseInt(self.el.price.data('product-price'))

     var margin = parseInt(self.config['Цена'])

      // var collection = self.el.collection.find('a').attr('href')

      var collection = '/collection/all'

      var link = function(margin){
       if ( margin ) {
         return collection + "?page_size=99&price_min=" + ( Math.round(price - margin) ) + "&price_max=" + (Math.round(price + margin))  + "&" + chars.join('&')
       } else {
         return collection + "?page_size=99&" + chars.join('&')
       }
     }

     self.render(
       link( margin )
       )

   }

   SimilarProducts.prototype.init = function(){

    var self = this;
    var chars = []

    if ( self.config && self.config['Параметры'] ) {

      self.config['Параметры'].forEach(function(char){

        var prop = $('['+ self.el.property + '="' + char + '"]').attr(self.el.char)

        if ( prop ) {
          chars.push(
            'characteristics[]=' + prop
            )
        }

      })

      if ( chars.length > 1 ) {
       self.link(chars)
     } else {
      self.el.container.fadeOut()
    }

  } else {
    console.warn('>> Не указаны параметры');
    self.el.container.fadeOut()
  }

}

return SimilarProducts

})()

jQuery(function(){

  new SimilarProducts({
    'Параметры' : [
    'brend',
    'seriya',
    'dekor'
    ],
      //'Цена' : 15000,
      'Колличество' : 100
    }) 

})

</script>
