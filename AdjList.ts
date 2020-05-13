/**
 * [child_id, node_order]
 */
export type AdjListEntry = [number, number];

export type AdjList = { [parent_id: number]: AdjListEntry };

export type AdjListDBRow = [number, number, number];
