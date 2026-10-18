-- ============================================================================
-- AMPLOFY MIGRATION: 008_startup_looking_for.sql
-- Startup "Looking For" System (Co-founders, Designers, Beta Testers, Collabs)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.startup_looking_for (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'co-founder',
        'designer-dev',
        'marketing',
        'beta-testers',
        'first-customers',
        'product-feedback',
        'startup-collab',
        'other'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_needed TEXT[] DEFAULT '{}',
    compensation_type TEXT NOT NULL CHECK (compensation_type IN (
        'equity',
        'paid',
        'stipend',
        'revenue-share',
        'free-product',
        'college-credit',
        'unpaid-collab'
    )),
    compensation_details TEXT,
    time_commitment TEXT NOT NULL,
    location_type TEXT NOT NULL DEFAULT 'hybrid' CHECK (location_type IN ('on-campus', 'remote', 'hybrid')),
    campus TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filled', 'paused')),
    response_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.looking_for_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.startup_looking_for(id) ON DELETE CASCADE,
    startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    applicant_whatsapp TEXT,
    applicant_instagram TEXT,
    applicant_college TEXT,
    applicant_major TEXT,
    role_or_pitch TEXT NOT NULL,
    portfolio_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'connected', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning-fast filtered lookups
CREATE INDEX IF NOT EXISTS idx_looking_for_startup_id ON public.startup_looking_for(startup_id);
CREATE INDEX IF NOT EXISTS idx_looking_for_type ON public.startup_looking_for(type);
CREATE INDEX IF NOT EXISTS idx_looking_for_status ON public.startup_looking_for(status);
CREATE INDEX IF NOT EXISTS idx_looking_for_compensation ON public.startup_looking_for(compensation_type);
CREATE INDEX IF NOT EXISTS idx_looking_for_created_at ON public.startup_looking_for(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_responses_request_id ON public.looking_for_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_responses_startup_id ON public.looking_for_responses(startup_id);
CREATE INDEX IF NOT EXISTS idx_responses_applicant_id ON public.looking_for_responses(applicant_id);

-- Enable RLS
ALTER TABLE public.startup_looking_for ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.looking_for_responses ENABLE ROW LEVEL SECURITY;

-- Policies for startup_looking_for
CREATE POLICY "Public read for open looking-for requests"
    ON public.startup_looking_for FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create looking-for requests"
    ON public.startup_looking_for FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Founders can update their looking-for requests"
    ON public.startup_looking_for FOR UPDATE
    USING (auth.uid() IN (
        SELECT owner_id FROM public.startups WHERE id = startup_looking_for.startup_id
    ));

CREATE POLICY "Founders can delete their looking-for requests"
    ON public.startup_looking_for FOR DELETE
    USING (auth.uid() IN (
        SELECT owner_id FROM public.startups WHERE id = startup_looking_for.startup_id
    ));

-- Policies for looking_for_responses
CREATE POLICY "Applicants and Startup owners can read responses"
    ON public.looking_for_responses FOR SELECT
    USING (
        auth.uid() = applicant_id OR
        auth.uid() IN (
            SELECT owner_id FROM public.startups WHERE id = looking_for_responses.startup_id
        )
    );

CREATE POLICY "Authenticated students can submit responses"
    ON public.looking_for_responses FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Founders can update response status"
    ON public.looking_for_responses FOR UPDATE
    USING (auth.uid() IN (
        SELECT owner_id FROM public.startups WHERE id = looking_for_responses.startup_id
    ));
