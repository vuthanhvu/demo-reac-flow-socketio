import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';
// import useWebSocket from 'react-use-websocket';

import { socket } from './socket';



const initialNodes = [
  {
    id: 'provider-1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: 'provider-2', data: { label: 'Node 2' }, position: { x: 400, y: 100 } },
  { id: 'provider-3', data: { label: 'Node 3' }, position: { x: 250, y: 150 } },
  { id: 'provider-4', data: { label: 'Node 4' }, position: { x: 100, y: 100 } },
];

const initialEdges = [
  {
    id: 'provider-e1-2',
    source: 'provider-1',
    target: 'provider-2',
    animated: true,
  },
  { id: 'provider-e1-3', source: 'provider-1', target: 'provider-3' },
];

const ProviderFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: any) => setEdges((els: any) => addEdge(params, els)), []);

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]) as any;


  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value:any) {
      setFooEvents((previous: any) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('update', onFooEvent);
    };
  }, []);


  // const { sendJsonMessage, readyState, lastMessage } = useWebSocket(WS_URL, {
  //   onOpen: () => {
  //     console.log('WebSocket connection established.');
  //   },
  //   share: true,
  //   filter: () => false,
  //   retryOnError: true,
  //   shouldReconnect: () => true
  // });

  // useEffect(() => {
  //   console.log(`==>\n`, edges);
  // }, [edges, setEdges])

  // useEffect(() => {
  //   console.log(`==>\n`, lastMessage);
  // }, [lastMessage])

  // useEffect(() => {
  //   console.log(`==>Nodes\n`, nodes);
  //   socket.emit('update', nodes);


  //   // console.log(`==>readyState\n`, readyState);
  //   // sendJsonMessage({
  //   //   nodes,
  //   //   type: 'message'
  //   // });

  // }, [nodes, setNodes])

  useEffect(() => {
    console.log(`==>Nodes\n`, nodes);
    socket.emit('update', nodes);

    // console.log(`==>readyState\n`, readyState);
    // sendJsonMessage({
    //   nodes,
    //   type: 'message'
    // });

  }, [nodes, setNodes])

  useEffect(() => {
    console.log(`==>fooEvents112`, fooEvents);
    socket.connect();
  
    function onFooEvent(value: any) {
      setFooEvents(value);
    }
  
    socket.on('response', onFooEvent);
  
    return () => {
      socket.off('response', onFooEvent);
      // BAD: the Socket.IO client will reconnect every time the fooEvents array
      // is updated
      socket.disconnect();
    };
  }, [fooEvents]);
  
  

  return (
    <div className="providerflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar nodes={nodes} setNodes={setNodes} />
      </ReactFlowProvider>
    </div>
  );
};

export default ProviderFlow;
