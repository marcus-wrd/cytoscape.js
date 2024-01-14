import * as util from '../../util';

let defaults = {
  ready: function(){},
  stop: function(){},
  maxHeight: 5,
  nodeDistance: 100,
  treeDistance: 200
};

function TreeLayout( options ){
  this.options = util.extend( {}, defaults, options );
}
  
TreeLayout.prototype.run = function(){
  let options = this.options;
  let layout = this;
  let maxHeight = options.maxHeight;
  let nodeDistance = options.nodeDistance;
  let treeDistance = options.treeDistance;
  let eles = options.eles; 
  let roots = eles.roots();

  layout.emit( 'layoutstart' );

  // Calculate the layout
  let calculateLayout = function( root, level, xOffset, yOffset ) {
    if( level > maxHeight ) return;

    let children = root.outgoers(); // assumes a directed acyclic graph

    // Position node
    root.position({ x: xOffset, y: yOffset });

    let siblings = children.connectedEdges().connectedNodes();
    let siblingCount = siblings.length;

    siblings.each( function( i, sibling ) {
      let direction = i % 2 === 0 ? 1 : -1;
      let nextXOffset = xOffset + direction * ( siblingCount * nodeDistance / 2 );
      let nextYOffset = yOffset + treeDistance;

      // Recursively calculate the layout
      calculateLayout( sibling, level + 1, nextXOffset, nextYOffset );
    });
  }

  // Calculate for each root
  roots.each( function( i, root ) {
    calculateLayout( root, 0, 0, i * treeDistance );
  });

  layout.one( 'layoutready', options.ready );
  layout.emit( 'layoutready' );

  layout.one( 'layoutstop', options.stop );
  layout.emit( 'layoutstop' );

  return this;
};

TreeLayout.prototype.stop = function(){
  return this; 
};

export default TreeLayout;
