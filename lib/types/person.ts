export interface Person {
    uuid: string
    name: string
    relation: Relation
    birthDate: string
    birthTime: string
    birthLocation: string
}

export interface Relation {
    uuid: string
    name: null | 'child' | 'business' | 'friend' | 'relationship'
}