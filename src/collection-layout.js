;(function($$){ 'use strict';
  
  // Functions for layouts on nodes
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  
  $$.fn.eles({

    // using standard layout options, apply position function (w/ or w/o animation)
    layoutPositions: function( layout, options, fn ){
      var nodes = this.nodes();
      var cy = this.cy();

      cy.trigger({ type: 'layoutstart', layout: layout });

      if( options.animate ){
        for( var i = 0; i < nodes.length; i++ ){
          var node = nodes[i];

          var newPos = fn.call( node, i, node );
          var pos = node.position();

          if( !$$.is.number(pos.x) || !$$.is.number(pos.y) ){
            node.silentPosition({ x: 0, y: 0 });
          }

          cy.one('layoutready', options.ready);
          cy.trigger({ type: 'layoutready', layout: layout });

          node.animate({
            position: newPos
          }, {
            duration: options.animationDuration,
            step: i != 0 ? undefined : function(){
              if( options.fit ){
                cy.fit( options.padding );
              } 
            },
            complete: i != nodes.length - 1 ? undefined : function(){
              if( options.zoom != null ){
                cy.zoom( options.zoom );
              }

              if( options.pan ){
                cy.pan( options.pan );
              } 
              
              cy.one('layoutstop', options.stop);
              cy.trigger({ type: 'layoutstop', layout: layout });
            }
          });
        }
      } else {
        nodes.positions( fn );

        if( options.fit ){
          cy.fit( options.padding );
        }

        if( options.zoom != null ){
          cy.zoom( options.zoom );
        }

        if( options.pan ){
          cy.pan( options.pan );
        } 

        cy.one('layoutready', options.ready);
        cy.trigger({ type: 'layoutready', layout: layout });
        
        cy.one('layoutstop', options.stop);
        cy.trigger({ type: 'layoutstop', layout: layout });
      }

      return this; // chaining
    }

  });
  
})( cytoscape );