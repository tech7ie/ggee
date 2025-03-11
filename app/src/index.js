import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

    // const resetItemsCount = useCallback(() => {
    //     setCountItems(itemsPerPage);
    //     setVisibleItems(filtredItems().slice(0, itemsPerPage));
    // }, [filtredItems]);

    // useEffect(() => {
    //     resetItemsCount();
    // }, [searchInput]);


// import React, { useState, useCallback, useEffect } from 'react';
// import {
//     DndContext,
//     closestCenter,
//     MouseSensor,
//     TouchSensor,
//     DragOverlay,
//     useSensor,
//     useSensors,
// } from '@dnd-kit/core';
// import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
// import Item from './Item';

// const localStorageDesk = (key) => 'DESK-' + key;
// const localStorageKey = 'KEY';

// const saveKey = (key) => {
//     localStorage.setItem(localStorageKey, key);
// }

// const removeKey = () => {
//     localStorage.removeItem(localStorageKey);
// }

// const getKey = () => {
//     return localStorage.getItem(localStorageKey) || null;
// }

// const saveArray = (items, deskKey) => {
//     localStorage.setItem(localStorageDesk(deskKey), JSON.stringify(items));
// };

// const getArray = (deskKey) => {
//     const savedItems = localStorage.getItem(localStorageDesk(deskKey));
//     if (savedItems) {
//         return JSON.parse(savedItems);
//     }
//     const generatedArray = generateArray(120);
//     saveArray(generatedArray, deskKey);
//     return generatedArray;
// };

// const generateArray = (count) => {
//     return Array.from({ length: count }).map((_, index) => ({
//         id: index,
//         title: `Item ${index}`,
//         checked: false
//     }));
// }

// const App = () => {
//     const [deskKey, setDeskKey] = useState('');
//     const [deskInput, setDeskInput] = useState('');

//     const [items, setItems] = useState(null);
//     const [loadedItems, setLoadedItems] = useState(null);
//     const [filtredItems, setFiltredItems] = useState(null)

//     const [activeItem, setActiveItem] = useState(null);
    
//     const [searchInput, setSearchInput] = useState('');
//     const countItems = 20;

//     const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

//     // setup on load
//     useEffect(() => {
//         const key = getKey();
//         if (key) {
//             setDeskKey(key);
//             const initItems = getArray(key);
//             setItems(initItems);
//             setLoadedItems(initItems.slice(0, countItems));
//         }
//     }, []);

//     // search
//     useEffect(() => {
//         if (items) {
//             const filteredItems = items.filter(item => 
//                 item.title.toLowerCase().includes(searchInput.toLowerCase())
//             );
//             setFiltredItems(filteredItems);
//             setLoadedItems(filteredItems.slice(0, countItems));
//         }
//     }, [searchInput]);

//     const applyDeskKey = (e) => {
//         e.preventDefault();
//         saveKey(deskInput);
//         setDeskKey(deskInput);
//     }

//     const updateElementChecked = (item, id) => item.id === id ? { ...item, checked: !item.checked } : item;

//     const handleCheckBoxChange = useCallback((id) => {
//         setItems((prevItems) => {
//             const updatedItems = prevItems.map((item) => updateElementChecked(item, id));
//             saveArray(updatedItems, deskKey);

//             const updatedLoadedItems = loadedItems.map((item) => updateElementChecked(item, id));
//             setLoadedItems(updatedLoadedItems);

//             return updatedItems;
//         });
//     }, [items, countItems, deskKey, loadedItems]);

//     const handleDragStart = useCallback((event) => {
//         const item = items.find(item => item.id === event.active.id);
//         setActiveItem(item);
//     }, [items]);

//     const findIdOverAndActive = (items, active, over) => {
//         const activeIndex = items.findIndex(item => item.id === active.id);
//         const overIndex = items.findIndex(item => item.id === over.id);
//         return [activeIndex, overIndex];
//     }

//     const handleDragEnd = useCallback((event) => {
//         const { active, over } = event;
//         if (active.id !== over?.id) {
//             setItems((items) => {
//                 const [activeIndex, overIndex] = findIdOverAndActive(items, active, over)
//                 const newItems = arrayMove(items, activeIndex, overIndex);
//                 saveArray(newItems, deskKey);

//                 const [activeLoadedIndex, overLoadedIndex] = findIdOverAndActive(loadedItems, active, over)
//                 const newItemsLoaded = arrayMove(loadedItems, activeLoadedIndex, overLoadedIndex);
//                 setLoadedItems(newItemsLoaded);

//                 return newItems;
//             });
//         }
//         setActiveItem(null);
//     }, [deskKey, countItems, loadedItems]);

//     const handleDragCancel = useCallback(() => {
//         setActiveItem(null);
//     }, []);

//     const handleScroll = (e) => {
//         const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;
//         if (bottom && loadedItems.length < items.length) {
//             setLoadedItems((prevLoadedItems) => [
//                 ...prevLoadedItems,
//                 ...items.slice(prevLoadedItems.length, prevLoadedItems.length + countItems)
//             ]);
//         }
//     };
//     return (
//         <>
//             { deskKey && items ?
//             <>
//                 <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     width: '100vw',
//                     justifyContent: 'center',
//                     alignItems: 'center'
//                 }}>
//                     <input
//                         id="searchInput" 
//                         onChange={e => setSearchInput(e.target.value)}
//                         placeholder="search..."
//                         style={{ width: '300px' }}
//                     />
//                     <DndContext
//                         sensors={sensors}
//                         collisionDetection={closestCenter}
//                         onDragStart={handleDragStart}
//                         onDragEnd={handleDragEnd}
//                         onDragCancel={handleDragCancel}
//                     >
//                         <SortableContext items={loadedItems.map(item => item.id)} strategy={rectSortingStrategy}>
//                             <div style={{overflowY: 'auto', height: '300px', width: '400px', backgroundColor: 'rgba(100,100,100,0.1)'}} onScroll={handleScroll}>
//                                 {loadedItems.map(({ id, title, checked }) => (
//                                     <Item
//                                         id={id}
//                                         title={title}
//                                         checked={checked}
//                                         handleCheckBoxChange={handleCheckBoxChange}
//                                         key={id}
//                                     />
//                                 ))}
//                             </div>
//                         </SortableContext>

//                         <DragOverlay adjustScale dropAnimation={{ duration: 0 }} style={{ transformOrigin: '0 0 ' }}>
//                             {activeItem ? (
//                                 <Item
//                                     id={activeItem.id+'ghost'}
//                                     key={activeItem.id+'ghost'}
//                                     title={activeItem.title}
//                                     checked={activeItem.checked}
//                                     handleCheckBoxChange={handleCheckBoxChange}
//                                 />
//                             ) : null}
//                         </DragOverlay>
//                     </DndContext>
//                     <div>
//                         <button onClick={() => {removeKey(); window.location.reload();}}>leave desk</button>
//                     </div>
//                 </div>
//             </>
//             :
//                 <form id="formId" onSubmit={applyDeskKey}>
//                     <input id="deskInput" onChange={e => setDeskInput(e.target.value)} placeholder="Enter desk key..." />
//                     <button type="submit">Apply</button>
//                 </form>
//             }
//         </>
//     );
// };

// export default App;
