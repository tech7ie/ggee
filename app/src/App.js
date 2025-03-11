import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import Item from './Item';

const localStorageDesk = (key) => 'DESK-' + key;
const localStorageKey = 'KEY';

const saveKey = (key) => {
    localStorage.setItem(localStorageKey, key);
}

const removeKey = () => {
    localStorage.removeItem(localStorageKey);
}

const getKey = () => {
    return localStorage.getItem(localStorageKey) || null;
}

const saveArray = (items, deskKey) => {
    localStorage.setItem(localStorageDesk(deskKey), JSON.stringify(items));
};

const getArray = (deskKey) => {
    const savedItems = localStorage.getItem(localStorageDesk(deskKey));
    if (savedItems) {
        return JSON.parse(savedItems);
    }
    const generatedArray = generateArray(120);
    saveArray(generatedArray, deskKey);
    return generatedArray;
};

const generateArray = (count) => {
    return Array.from({ length: count }).map((_, index) => ({
        id: index,
        title: `Item ${index}`,
        checked: false
    }));
}

const itemsPerPage = 20;

const App = () => {
    const [deskKey, setDeskKey] = useState('');
    const [deskInput, setDeskInput] = useState('');

    const [items, setItems] = useState(null);
    const [countItems, setCountItems] = useState(itemsPerPage);
    const [visibleItems, setVisibleItems] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    
    const [searchInput, setSearchInput] = useState('');

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    const scrollContainerRef = useRef(null);

    const setup = () => {
        const key = getKey();
        if (key) {
            setDeskKey(key);
            const initItems = getArray(key);
            setItems(initItems);
        }
    }
    useEffect(() => {
        setup();
    }, []);

    const applyDeskKey = (e) => {
        e.preventDefault();
        saveKey(deskInput);
        setup();
    }


    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
            setCountItems(20);
        }
    }, [searchInput]);

    useEffect(() => {
        if (!items) return;

        let filteredItems;
        if (searchInput !== '') {
            filteredItems = items.filter(item =>
                item.title.toLowerCase().includes(searchInput.toLowerCase())
            );
        } else {
            filteredItems = items;
        }
        setVisibleItems(filteredItems.slice(0, countItems));
    }, [items, countItems]);


    const handleCheckBoxChange = useCallback((id) => {
        setItems((prevItems) => {
            const updatedItems = prevItems.map((item) => 
                item.id === id ? { ...item, checked: !item.checked } : item
            );
            saveArray(updatedItems, deskKey);
            return updatedItems;
        });
    }, [deskKey]);

    const handleDragStart = useCallback((event) => {
        const item = items.find(item => item.id === event.active.id);
        setActiveItem(item);
    }, [items]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setItems((items) => {
                const activeIndex = items.findIndex(item => item.id === active.id);
                const overIndex = items.findIndex(item => item.id === over.id);
                const newItems = arrayMove(items, activeIndex, overIndex);
                saveArray(newItems, deskKey);
                return newItems;
            });
        }
        setActiveItem(null);
    }, [deskKey]);

    const handleDragCancel = useCallback(() => {
        setActiveItem(null);
    }, []);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 5;
         if (bottom) setCountItems((prevCount) => prevCount + 20);
    };
    
    return (
        <>
            { deskKey && visibleItems ?
            <>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100vw',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <input
                        id="searchInput" 
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder="search..."
                        style={{ width: '300px' }}
                    />
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext items={visibleItems.map(item => item.id)} strategy={rectSortingStrategy}>
                            <div ref={scrollContainerRef} style={{overflowY: 'auto', height: '300px', width: '400px', backgroundColor: 'rgba(100,100,100,0.1)'}} onScroll={handleScroll}>
                                {visibleItems.map(({ id, title, checked }) => (
                                    <Item
                                        id={id}
                                        title={title}
                                        checked={checked}
                                        handleCheckBoxChange={handleCheckBoxChange}
                                        key={id}
                                    />
                                ))}
                            </div>
                        </SortableContext>

                        <DragOverlay adjustScale dropAnimation={{ duration: 0 }} style={{ transformOrigin: '0 0 ' }}>
                            {activeItem ? (
                                <Item
                                    id={activeItem.id+'ghost'}
                                    key={activeItem.id+'ghost'}
                                    title={activeItem.title}
                                    checked={activeItem.checked}
                                    handleCheckBoxChange={handleCheckBoxChange}
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                    <div>
                        <button onClick={() => {removeKey(); window.location.reload();}}>leave desk</button>
                    </div>
                </div>
            </>
            :
                <form id="formId" onSubmit={applyDeskKey}>
                    <input id="deskInput" onChange={e => setDeskInput(e.target.value)} placeholder="Enter desk key..." />
                    <button type="submit">Apply</button>
                </form>
            }
        </>
    );
};

export default App;
