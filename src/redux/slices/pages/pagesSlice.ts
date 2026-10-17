import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page } from './pageType';
import { createPageThunk, deletePageThunk, fetchFastApiPagesThunk, fetchPageBySlugThunk, fetchPagesThunk, savePageContentThunk, updatePageThunk } from './pageThunk';
import homePageData from '@/lib/pages/homePage.json';
import aboutPageData from '@/lib/pages/aboutPage.json';
import servicesPageData from '@/lib/pages/servicesPage.json';
import caseStudiesPageData from '@/lib/pages/caseStudiesPage.json';
import contactPageData from '@/lib/pages/contactPage.json';
import industriesPageData from '@/lib/pages/industriesPage.json';
import technologiesPageData from '@/lib/pages/technologiesPage.json';

const defaultPages: Page[] = [
  { _id: 'home', id: 'home', ...homePageData } as any,
  { _id: 'about', id: 'about', ...aboutPageData } as any,
  { _id: 'services', id: 'services', ...servicesPageData } as any,
  { _id: 'case-studies', id: 'case-studies', ...caseStudiesPageData } as any,
  { _id: 'contact', id: 'contact', ...contactPageData } as any,
  { _id: 'industries', id: 'industries', ...industriesPageData } as any,
  { _id: 'technologies', id: 'technologies', ...technologiesPageData } as any,
];

interface PageState {
  allPages: Page[];
  currentPages: Page | null;
  isAllPageFetched: boolean;
  isError: boolean;
  isLoading: boolean;
  isEditablePage:boolean
}

const initialState: PageState = {
  allPages: defaultPages,
  currentPages: defaultPages[0],
  isAllPageFetched: false,
  isError: false,
  isLoading: false,
  isEditablePage:false,

};

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    setAllPages: (state, action: PayloadAction<Page[]>) => {
      state.allPages = action.payload;
      state.isAllPageFetched = true;
      state.isLoading = false;
    },
    setCurrentPages: (state, action: PayloadAction<Page | null>) => {
      state.currentPages = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditablePage = action.payload;
    },
    updateContentField: (state, action: PayloadAction<{ sectionId: string; fieldPath: string; value: string }>) => {
      if (!state.currentPages?.content) return;
      const idx = state.currentPages.content.findIndex((s: any) => s.id === action.payload.sectionId);
      if (idx === -1) return;
      const parts = action.payload.fieldPath.split('.');
      let obj: any = state.currentPages.content[idx];
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all pages
      .addCase(fetchPagesThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPagesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.length > 0) {
          state.allPages = action.payload;
          const currentSlug = state.currentPages?.slug || "home";
          const data = action.payload.find((page: Page) => page.slug === currentSlug) || action.payload.find((page: Page) => page.slug === "home");
          if (data) {
            state.currentPages = data;
          }
        }
        state.isAllPageFetched = true;
      })
      .addCase(fetchPagesThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAllPageFetched = true;
      })
      //feetch all, page through fast Api calling
// /api/cms/pages
       .addCase(fetchFastApiPagesThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
       })
       .addCase(fetchFastApiPagesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload && action.payload.length > 0) {
          state.allPages = action.payload;
          const currentSlug = state.currentPages?.slug || "home";
          const data = action.payload.find((page: Page) => page.slug === currentSlug) || action.payload.find((page: Page) => page.slug === "home");
          if (data) {
            state.currentPages = data;
          }
        }
        state.isAllPageFetched = true;
       })
       .addCase(fetchFastApiPagesThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
        state.isAllPageFetched = true;
       }) 
      // Fetch single page
      .addCase(fetchPageBySlugThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchPageBySlugThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPages = action.payload;
      })
      .addCase(fetchPageBySlugThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Create page
      .addCase(createPageThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createPageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPages.push(action.payload);
      })
      .addCase(createPageThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Update page
      .addCase(updatePageThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updatePageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.allPages.findIndex(page => page._id === action.payload._id);
        if (index !== -1) {
          state.allPages[index] = action.payload;
        }
        if (state.currentPages?._id === action.payload._id) {
          state.currentPages = action.payload;
        }
      })
      .addCase(updatePageThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      // Delete page
      .addCase(deletePageThunk.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deletePageThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allPages = state.allPages.filter(page => page._id !== action.payload);
        if (state.currentPages?._id === action.payload) {
          state.currentPages = null;
        }
      })
      .addCase(deletePageThunk.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(savePageContentThunk.pending, (state) => {
        state.isError = false;
      })
      .addCase(savePageContentThunk.fulfilled, (state, action) => {
        if (action.payload) {
          const id = (action.payload as any).id || (action.payload as any)._id;
          const idx = state.allPages.findIndex((p: any) => (p.id || p._id) === id);
          if (idx !== -1) state.allPages[idx] = action.payload;
          state.currentPages = action.payload;
        }
      })
      .addCase(savePageContentThunk.rejected, (state) => {
        state.isError = true;
      });
  },
});

export const { setAllPages, setCurrentPages, setLoading, setError, setEditMode, updateContentField } = pagesSlice.actions;
export default pagesSlice.reducer;
