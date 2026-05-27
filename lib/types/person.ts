import { type BirthLocation } from '@/lib/types/userProfile';
export interface Person {
    uuid: string
    name: string
    relation: Relation
    birthDate: string
    birthTime: string
    birthLocation: BirthLocation
}

export interface Relation {
    uuid: string
    name: null | 'child' | 'business' | 'friend' | 'relationship'
}