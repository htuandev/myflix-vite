export enum Role {
  Admin = '8816',
  User = '0808'
}

export enum HeaderKey {
  clientId = 'x-client-id',
  apiKey = 'x-api-key',
  contentType = 'content-type'
}

export enum Gender {
  Female = 1,
  Male = 2
}

export enum SubtitleType {
  VietSub = 1,
  EngSub = 2,
  VietDub = 3
}

export enum ContentType {
  Movie = 1,
  TVSeries = 2,
  TVShow = 3
}

export enum Status {
  Upcoming = 1,
  OnGoing = 2,
  Ended = 3,
  Released = 4,
  Trailer = 5
}
