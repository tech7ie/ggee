import { useSortable } from '@dnd-kit/sortable';
import { CSS } from "@dnd-kit/utilities";
import React, { useState } from 'react';

const Item = ({ id, title, checked, handleCheckBoxChange }) => {
    const {
        isDragging,
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };

    const inlineStyles = {
        color: 'white',
        opacity: isDragging ? '0.5' : '1',
        cursor: isDragging ? 'grabbing' : 'grab',
        display: 'flex',
        alignItems: 'center',
        textDecoration: checked ? 'line-through' : 'none',
        minWidth: '300px', 
        ...style
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} id={id}>
            <input
                id={id+'input'}
                type='checkbox'
                style={{ marginBottom: '0', ...style }}
                checked={checked}
                onChange={() => handleCheckBoxChange(id)}
                ref={setNodeRef}
                {...attributes}
            />
            <div ref={setNodeRef} style={inlineStyles} id={id+'child'} {...attributes} {...listeners}>{title}</div>
        </div>
    );
};
export default Item;