import { Node } from '@/utils/tree'

export interface Schema {
  id: string
  name: string
  group: string
  groupId: string
}

export type LoginRequest = {
  username: string
  password: string
  UTCOffset?: number
}

export type LoginResponse = string

export type SchemaResponse = {
  ID: string
  Name: string
  GroupID: string
  Group: string
}

export interface EnumDevicesDTO {
  ID: string
  Groups: Group[]
  Items: Item[]
  VirtualTrees: any[]
  VirtualTreeAssigned: any
}

export interface GroupDTO {
  ID: string
  ParentID?: string
  Name: string
}

export interface ItemDTO {
  Serial: number
  Allowed: boolean
  Properties: Property[]
  FixedLocation: any
  Image: string
  ImageColored: string
  TripSplitters: TripSplitter[]
  IsAreaEnabled: boolean
  ImageHue: number
  ID: string
  ParentID: string
  Name: string
}

export interface PropertyDTO {
  Inherited: boolean
  Type: number
  Name: string
  Value: any
}

export interface TripSplitterDTO {
  ID: number
  Name: string
}

export interface EnumDevices {
  id: string
  groups: DevicesGroup[]
  items: DeviceItem[]
  virtualTrees: any[]
  virtualTreeAssigned: any
}

export interface DevicesGroup extends Node<string, string> {
  name: string
}

export interface DeviceItem extends Node<string, string> {
  serial: number
  allowed: boolean
  properties: Property[]
  fixedLocation: any
  image: string
  imageColored: string
  tripSplitters: TripSplitter[]
  isAreaEnabled: boolean
  imageHue: number
  name: string
}

export interface Property {
  inherited: boolean
  type: number
  name: string
  value: any
}

export interface TripSplitter {
  id: number
  name: string
}

// Geofences DTO
export interface EnumGeofencesDTO {
  id: string
  groups: GeofencesGroupDTO[]
  items: GeofencesItemDTO[]
  virtualTrees: GeofencesVirtualTreeDTO[]
  virtualTreeAssigned: string
}

export interface GeofencesGroupDTO {
  id: string
  parentID: string
  name: string
}

export interface GeofencesItemDTO {
  id: string
  parentID: string
  name: string
  properties: GeofencesPropertyDTO[]
  image: string
  imageColored: string
}

export interface GeofencesPropertyDTO {
  inherited: boolean
  type: number
  name: string
  value: string
}

export interface GeofencesVirtualTreeDTO {
  id: string
  name: string
}

// Geofences

export interface EnumGeofences {
  id: string
  groups: GeofencesGroup[]
  items: GeofencesItem[]
  virtualTrees: GeofencesVirtualTree[]
  virtualTreeAssigned: string
}

export interface GeofencesGroup extends Node<string, string> {
  name: string
}

export interface GeofencesItem extends Node<string, string> {
  id: string
  parentId: string
  name: string
  properties: GeofencesProperty[]
  image: string
  imageColored: string
}

export interface GeofencesProperty {
  inherited: boolean
  type: number
  name: string
  value: string
}

export interface GeofencesVirtualTree {
  id: string
  name: string
}

// TrackDto

export type TrackDto = Record<string, Track[]>

export interface Track {
  index: number
  dt: string[]
  speed: number[]
  lat: number[]
  lng: number[]
  photos: any
  colorSettings: ColorSettings
}

export interface ColorSettings {
  definedBy: number
  parameter: Parameter
  defaultColor: string
  trackMaxDuration: number
  values: number[][]
}

export interface Parameter {
  name: string
  colors: Color[]
  min: number
  max: number
}

export interface Color {
  color: string
  value: number
}

// ZoneDto - Geofences

export type ZoneDto = Record<string, Zone>

export interface Zone {
  id: string
  parentId: string
  name: string
  isPolygon: boolean
  r: number
  lat: number[]
  lng: number[]
  holes: any
  imageName: string
  imageHue: number
  fill: number
  line: number
  lineWidth: number
}
