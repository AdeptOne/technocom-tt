import request from '@/utils/request'
import type {
  LoginRequest,
  LoginResponse,
  EnumDevices,
  EnumGeofences,
  Schema,
  TrackDto,
  ZoneDto,
} from './types'
import { useSession } from '@/store/session'
import dayjs from 'dayjs'

const service = request('serviceJSON')

export const login = (params: LoginRequest): Promise<LoginResponse> =>
  service.post('/login', null, {
    params,
  })

export const getEnumSchemas = () => {
  const session = useSession()

  return service.get<any, Schema[]>('/enumSchemas', {
    params: {
      session: session.token,
    },
  })
}

export const getEnumDevices = (schemaId: string) => {
  const session = useSession()

  return service.get<any, EnumDevices>('/enumDevices', {
    params: {
      session: session.token,
      schemaID: schemaId,
    },
  })
}

export const getEnumGeoFences = (schemaId: string) => {
  const session = useSession()

  return service.get<any, EnumGeofences>('/enumGeoFences', {
    params: {
      session: session.token,
      schemaID: schemaId,
    },
  })
}

export const getTrack = (devicesIds: string[] = [], tripSplitterIndex: number = 0) => {
  const session = useSession()
  const dateFormat = 'YYYYMMDD'
  const currentDate = dayjs().subtract(1, 'day')

  return service.get<any, TrackDto>('/getTrack', {
    params: {
      session: session.token,
      schemaID: session.schemaId,
      IDs: devicesIds.join(','),
      SD: currentDate.format(dateFormat),
      ED: currentDate.add(1, 'day').format(dateFormat),
      tripSplitterIndex,
    },
  })
}

export const getGeofences = (geofencesIds: string[] = []) => {
  const session = useSession()

  return service.get<any, ZoneDto>('/getGeofences', {
    params: {
      session: session.token,
      schemaID: session.schemaId,
      IDs: geofencesIds.join(','),
    },
  })
}
