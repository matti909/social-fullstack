import { inject, Injectable } from '@angular/core';
import { SetUserBioGQL, SetUserPhotoGQL, SetUserCoverGQL } from '../../../../core/gql.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private setUserBioGQL = inject(SetUserBioGQL);
  private setUserPhotoGQL = inject(SetUserPhotoGQL);
  private setUserCoverGQL = inject(SetUserCoverGQL);

  setUserBio(bio: string) {
    return this.setUserBioGQL
      .mutate({ variables: { bio } })
      .pipe(map((result) => result.data?.setUserBio));
  }

  setUserPhoto(photoImage: File) {
    return this.setUserPhotoGQL
      .mutate({
        variables: { file: photoImage },
        context: { useMultipart: true },
      })
      .pipe(map((result) => result.data?.setUserPhoto));
  }

  setUserCover(coverImage: File) {
    return this.setUserCoverGQL
      .mutate({
        variables: { file: coverImage },
        context: { useMultipart: true },
      })
      .pipe(map((result) => result.data?.setUserCover));
  }
}
