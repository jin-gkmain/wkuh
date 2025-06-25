import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export type VideoModalStateType = "new" | "manage" | "view";

export type VideoSliceState = {
  selectedVideo: Video | null;
  videos: Video[];
  modalStateType: VideoModalStateType;
  patientId: number | null;
  isModalOpen: boolean;
  edit: [number];
};

const initialState: VideoSliceState = {
  selectedVideo: null,
  videos: [],
  modalStateType: "new",
  patientId: null,
  isModalOpen: false,
  edit: [0],
};

// Date 객체를 string으로 변환하는 헬퍼 함수
const normalizeVideo = (video: Video): Video => {
  return {
    ...video,
    di_date: dayjs(video.di_date).toDate(),
  };
};

const normalizeVideos = (videos: Video[]): Video[] => {
  return videos.map(normalizeVideo);
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    setSelectedVideo: (state, action: PayloadAction<Video | null>) => {
      state.selectedVideo = action.payload
        ? normalizeVideo(action.payload)
        : null;
    },
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = normalizeVideos(action.payload);
    },
    addVideo: (state, action: PayloadAction<Video>) => {
      const normalizedVideo = normalizeVideo(action.payload);
      state.videos = [normalizedVideo, ...state.videos];
    },
    updateVideo: (state, action: PayloadAction<Video>) => {
      const normalizedVideo = normalizeVideo(action.payload);
      const index = state.videos.findIndex(
        (v) => v.v_idx === normalizedVideo.v_idx
      );
      if (index !== -1) {
        state.videos[index] = normalizedVideo;
      }
    },
    removeVideo: (state, action: PayloadAction<number>) => {
      state.videos = state.videos.filter((v) => v.v_idx !== action.payload);
    },
    setModalStateType: (state, action: PayloadAction<VideoModalStateType>) => {
      state.modalStateType = action.payload;
    },
    setPatientId: (state, action: PayloadAction<number | null>) => {
      state.patientId = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ video?: Video; type: VideoModalStateType }>
    ) => {
      state.isModalOpen = true;
      state.selectedVideo = action.payload.video
        ? normalizeVideo(action.payload.video)
        : null;
      state.modalStateType = action.payload.type;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedVideo = null;
      state.modalStateType = "new";
    },
    manageVideo: (
      state,
      action: PayloadAction<{ video: Video; p_idx: number }>
    ) => {
      state.selectedVideo = normalizeVideo(action.payload.video);
      state.patientId = action.payload.p_idx;
      state.modalStateType = "manage";
      state.isModalOpen = true;
    },
    edit: (state) => {
      if (state.selectedVideo) {
        state.edit = [state.selectedVideo.v_idx];
      }
    },
  },
});

export default videoSlice;
export const videoActions = { ...videoSlice.actions };
