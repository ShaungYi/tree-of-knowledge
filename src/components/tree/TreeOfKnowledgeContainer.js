import styled from "styled-components";
import D3Tree from "./D3Tree";
import BushNode from "../bush/BushNode";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styles from '../tree.module.css'
import React, { useEffect } from "react";
import useZoom from "../../hooks/use-zoom";
import useDimensions from "../../hooks/use-dimensions";
import { renderedDimensionsActions } from "../../store/store";



const TreeOfKnowledgeContainerRoot = styled.div`
    width: ${props => (`${props.width}px`)};
    height: ${props => (`${props.height}px`)};
    /* border:1px solid red; */
    
    scale: ${props => (props.scale)};


    & #treeContainerG{
      position:relative;
      visibility: visible;
      pointer-events: visible;
    }

    & #treeContainerSvg{
      overflow: visible;
    }

    & #${props => (props.zoomActionTargetDivId)}{
      width: ${props => (`${props.width}px`)};
      height: ${props => (`${props.height}px`)};
      position:relative;
    }

`


function TreeOfKnowledgeContainer(props){

    console.log('rendering tree container')
    const [data, treeOverlayElementsContainerId] = useSelector((state) => [
      state.treeData.structure, 
      state.importantElementIds.treeOverlayElementsContainerId], shallowEqual)
    const visionScale = useSelector((state) => state.zoom.visionScale, shallowEqual)
    const scale = useSelector((state) => state.scale.treeScale, shallowEqual)


    //tree dimensions
    const [treeWidth, treeHeight] = useSelector((state) => [
      state.dimensions[visionScale].treeWidth, 
      state.dimensions[visionScale].treeHeight], shallowEqual)


    const [bushWidth, bushHeight, bushPadding] = useSelector((state) => [
      state.dimensions[visionScale].bushWidth, 
      state.dimensions[visionScale].bushHeight, 
      state.dimensions.bushPadding], shallowEqual)



    const nodesGId = "mainNodes"
    const linksGId = "mainLinks"
    const containerGId = useSelector((state) => 
      state.importantElementIds.treeContainerGId, shallowEqual)

    const zoomActionTargetDivId = 'zoomActionTargetDiv'

    const treeContainerG = document.getElementById('treeContainerG')
    
    const computeRenderedTreeDimensions = () => {
      console.log(treeContainerG.getBoundingClientRect().width / scale + 60)
      return [
        treeContainerG.getBoundingClientRect().width / scale + 60, //width (+60 - temporary fix to dimension mismatch)
        treeContainerG.getBoundingClientRect().height / scale //height
      ]
    } 

    const [renderedTreeWidth, renderedTreeHeight] = 
      useDimensions(computeRenderedTreeDimensions, treeWidth, treeHeight)

    
    //store tree width
    const dispatch = useDispatch()

    useEffect(() => {dispatch(renderedDimensionsActions.setTreeDimensions({
      width: renderedTreeWidth,
      height: renderedTreeHeight
    }))})


    useZoom(
      'zoomWindow', 
      `${containerGId}`, 
      renderedTreeWidth, 
      renderedTreeHeight)
    



    return(
        <TreeOfKnowledgeContainerRoot 
              id='treeOfKnowledgeContainerRoot' 
              zoomActionTargetDivId={zoomActionTargetDivId}
              width={renderedTreeWidth} 
              height={renderedTreeHeight} 
              scale={scale}>  

            <D3Tree 
              data={data} 
              nodesGId={nodesGId} 
              linksGId={linksGId}
              containerGId={containerGId}
              treeOverlayElementsContainerId={treeOverlayElementsContainerId}
              containerSvgId='treeContainerSvg'
              treeWidth={treeWidth}
              treeHeight={treeHeight}
              nodeWidth={bushWidth}
              nodeHeight={bushHeight}
              nodePadding={bushPadding}
              linkClass={styles.mainLink}
              nodeComponentFunc={BushNode}/> 
             
        </TreeOfKnowledgeContainerRoot>

    )
}
export default React.memo(TreeOfKnowledgeContainer)