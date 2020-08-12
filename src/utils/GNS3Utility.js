export const uploadFile = async (files) => {
  const topologyJSON = await readFileAsync(files[0]);
  //console.log(topologyJSON);

  let lanList = [];
  if (topologyJSON) lanList = solveTopology(topologyJSON);
  return lanList;
};

const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    try {
      let fileReader = new FileReader();
      fileReader.readAsText(file);

      fileReader.onload = () => {
        resolve(JSON.parse(fileReader.result).topology);
      };
    } catch (error) {
      reject(error);
    }
  });
};

const solveTopology = (topologyJSON) => {
  const { links, nodes } = topologyJSON;
  const nodeTypeHashMap = getNodeTypeHashMap(nodes);
  // console.log(nodeTypeHashMap);
  const nodeIdToNumber = getNodeIdtoNumber(nodes);
  const nodeNumberToId = getNodeNumberToId(nodes);
  // console.log(nodeIdToNumber);
  // console.log(nodeNumberToId);
  const routerList = getRouters(nodes);
  // console.log('Routers:', routerList);

  const graph = buildGraph(links, nodeTypeHashMap, nodeIdToNumber);
  // console.log(graph);

  const lanList = getLanList(
    graph,
    routerList,
    nodeIdToNumber,
    nodeNumberToId,
    nodeTypeHashMap
  );

  return lanList;
};

const getRouters = (nodeList) => {
  let routers = nodeList.filter((node) => node.node_type === 'dynamips');
  return routers;
};

const getNodeTypeHashMap = (nodeList) => {
  let nodes = [];
  let type = '';
  let idx = 0;

  nodeList.map((node) => {
    if (node.node_type === 'dynamips') type = 'router';
    else if (node.node_type === 'vpcs') type = 'pc';
    else type = 'switch';

    nodes[node.node_id] = type;
    nodes.length = idx++;
  });
  return nodes;
};

const getNodeIdtoNumber = (nodeList) => {
  let idx = 0;
  let nodes = [];

  nodeList.map((node) => {
    nodes[node.node_id] = idx++;
    nodes.length = idx;
  });
  return nodes;
};

const getNodeNumberToId = (nodeList) => {
  let idx = 0;
  let nodes = [];

  nodeList.map((node) => {
    nodes[idx++] = node.node_id;
    nodes.length = idx;
  });
  return nodes;
};

const buildGraph = (linkList, nodeType, nodeId) => {
  let graph = [];
  const n = nodeId.length;

  for (let i = 0; i < n; i++) graph[i] = [];

  linkList.map((link) => {
    // console.log(
    //   nodeType[link.nodes[0].node_id],
    //   nodeType[link.nodes[1].node_id]
    // );

    let idA = link.nodes[0].node_id;
    let idB = link.nodes[1].node_id;

    let typeA = nodeType[idA];
    let typeB = nodeType[idB];

    // console.log(nodeId[idA], nodeId[idB]);

    if (
      (typeA === 'switch' && typeB === 'pc') ||
      (typeA === 'router' && typeB === 'switch')
    ) {
      graph[nodeId[idA]].push(nodeId[idB]);
    } else if (
      (typeA === 'pc' && typeB === 'switch') ||
      (typeA === 'switch' && typeB === 'router')
    ) {
      graph[nodeId[idB]].push(nodeId[idA]);
    } else if (typeA === 'switch' && typeB === 'switch') {
      graph[nodeId[idA]].push(nodeId[idB]);
      graph[nodeId[idB]].push(nodeId[idA]);
    }
  });

  return graph;
};

const getLanList = (graph, routers, nodeNumber, nodeId, nodeType) => {
  let lanList = [];

  routers.map((router) => {
    let size = getLanSize(router.node_id, graph, nodeNumber, nodeId, nodeType);
    lanList.push({ name: router.name, hostNumber: size });
  });

  return lanList;
};

const getLanSize = (router, graph, nodeNumber, nodeId, nodeType) => {
  let routerId = nodeNumber[router];
  let size = 0;

  let level = [];
  for (let i = 0; i < nodeNumber.length; i++) level[i] = -1;
  let queue = [routerId];
  level[routerId] = 0;

  while (queue.length > 0) {
    let top = queue[0];
    queue.shift();
    if (nodeType[nodeId[top]] !== 'switch') size++;
    // console.log(nodeType[nodeId[top]]);

    graph[top].map((next) => {
      if (level[next] === -1) {
        level[next] = level[top] + 1;
        queue.push(next);
      }
    });
  }
  // console.log('\n');
  return size;
};
