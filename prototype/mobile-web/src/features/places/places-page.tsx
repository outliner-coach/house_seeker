import { placeTypeValues, type PlaceRecord, type PlaceType } from '@house-seeker/shared'
import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { usePlaceCaptures } from '@/features/captures/use-place-captures'
import { placeSummaries } from '@/features/household/mock-data'
import { useLocale } from '@/features/i18n/use-locale'
import { useHouseholdPlaces } from './use-household-places'

type PlaceDraft = {
  name: string
  parentPlaceId: string
  type: PlaceType
}

const initialDraft: PlaceDraft = {
  name: '',
  parentPlaceId: '',
  type: 'fixed',
}

function countChildren(places: PlaceRecord[], placeId: string) {
  return places.filter((place) => place.parentPlaceId === placeId).length
}

function findPlaceChain(placesById: Map<string, PlaceRecord>, selectedPlaceId: string | null) {
  if (!selectedPlaceId) {
    return [] as PlaceRecord[]
  }

  const chain: PlaceRecord[] = []
  let current = placesById.get(selectedPlaceId) ?? null

  while (current) {
    chain.unshift(current)
    current = current.parentPlaceId ? placesById.get(current.parentPlaceId) ?? null : null
  }

  return chain
}

export function PlacesPage() {
  const { formatError, t } = useLocale()
  const {
    createPlace,
    createPlaceError,
    isCreatingPlace,
    isShellMode,
    places,
    placesError,
    placesLoading,
  } = useHouseholdPlaces()
  const [draft, setDraft] = useState<PlaceDraft>(initialDraft)
  const [captureMessage, setCaptureMessage] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places])
  const selectedPlace = selectedPlaceId ? placesById.get(selectedPlaceId) ?? null : null
  const currentChain = useMemo(
    () => findPlaceChain(placesById, selectedPlaceId),
    [placesById, selectedPlaceId],
  )
  const visiblePlaces = useMemo(
    () => places.filter((place) => place.parentPlaceId === selectedPlaceId),
    [places, selectedPlaceId],
  )
  const parentPreview = draft.parentPlaceId ? placesById.get(draft.parentPlaceId) ?? null : null
  const nextPathPreview = draft.name.trim()
    ? parentPreview
      ? `${parentPreview.placePath} > ${draft.name.trim()}`
      : draft.name.trim()
    : parentPreview?.placePath ?? t('places.headingRoot')
  const {
    captures,
    capturesError,
    capturesLoading,
    isUploadingCapture,
    uploadCapture,
    uploadCaptureError,
  } = usePlaceCaptures(selectedPlace)

  function openCreateForm(parentPlaceId: string | null) {
    setDraft({
      name: '',
      parentPlaceId: parentPlaceId ?? '',
      type: parentPlaceId ? 'container' : 'fixed',
    })
    setFormMessage('')
    setShowForm(true)
  }

  async function handleCaptureSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setCaptureMessage('')

    try {
      const capture = await uploadCapture(file)
      setCaptureMessage(
        t('places.captureUploaded', {
          id: capture.id,
          path: selectedPlace?.placePath ?? t('places.headingRoot'),
        }),
      )
    } catch (error) {
      setCaptureMessage(formatError(error, 'error.capture.uploadUnavailable'))
    } finally {
      event.target.value = ''
    }
  }

  async function handleCreatePlace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')

    try {
      const createdPlace = await createPlace({
        name: draft.name,
        parentPlaceId: draft.parentPlaceId || null,
        type: draft.type,
      })
      setSelectedPlaceId(createdPlace.id)
      setDraft(initialDraft)
      setShowForm(false)
      setFormMessage(
        t('places.created', {
          path: createdPlace.placePath,
        }),
      )
    } catch (error) {
      setFormMessage(formatError(error, 'error.place.creationUnavailable'))
    }
  }

  return (
    <div className="stack">
      <section className="panel stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('places.eyebrow')}</p>
            <h2 data-testid="selected-place-heading">
              {selectedPlace ? selectedPlace.name : t('places.headingRoot')}
            </h2>
          </div>
          <button data-testid="add-place-button" onClick={() => openCreateForm(selectedPlaceId)} type="button">
            {t('places.addPlace')}
          </button>
        </div>

        <p className="lede">{t('places.description')}</p>

        {currentChain.length > 0 ? (
          <div className="pill-row">
            <button className="secondary-button" onClick={() => setSelectedPlaceId(null)} type="button">
              {t('places.allPlaces')}
            </button>
            {currentChain.map((place) => (
              <button
                className="secondary-button"
                key={place.id}
                onClick={() => setSelectedPlaceId(place.id)}
                type="button"
              >
                {place.name}
              </button>
            ))}
          </div>
        ) : null}

        {selectedPlace ? (
          <div className="details-grid">
            <div>
              <dt>{t('places.path')}</dt>
              <dd>{selectedPlace.placePath}</dd>
            </div>
            <div>
              <dt>{t('places.childPlaces')}</dt>
              <dd>{countChildren(places, selectedPlace.id)}</dd>
            </div>
            <div>
              <dt>{t('places.status')}</dt>
              <dd>{t(`enum.placeStatus.${selectedPlace.status}`)}</dd>
            </div>
            <div>
              <dt>{t('places.lastVerified')}</dt>
              <dd>{selectedPlace.lastVerifiedAt ?? t('places.notCapturedYet')}</dd>
            </div>
          </div>
        ) : null}

        {formMessage ? <div className="notice">{formMessage}</div> : null}
        {captureMessage ? <div className="notice">{captureMessage}</div> : null}
        {placesError ? <div className="notice">{formatError(new Error(placesError), 'error.place.creationUnavailable')}</div> : null}
        {createPlaceError ? (
          <div className="notice">{formatError(new Error(createPlaceError), 'error.place.creationUnavailable')}</div>
        ) : null}
        {capturesError ? (
          <div className="notice">{formatError(new Error(capturesError), 'error.capture.uploadUnavailable')}</div>
        ) : null}
        {uploadCaptureError ? (
          <div className="notice">{formatError(new Error(uploadCaptureError), 'error.capture.uploadUnavailable')}</div>
        ) : null}
      </section>

      {showForm ? (
        <section className="panel stack">
          <div className="section-heading">
            <h3>{t('places.createForm')}</h3>
            <button className="secondary-button" onClick={() => setShowForm(false)} type="button">
              {t('places.close')}
            </button>
          </div>

          <form className="stack" onSubmit={handleCreatePlace}>
            <label className="stack" htmlFor="place-name">
              <span>{t('places.form.name')}</span>
              <input
                data-testid="place-name-input"
                id="place-name"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder={t('places.form.placeholder')}
                value={draft.name}
              />
            </label>

            <label className="stack" htmlFor="place-type">
              <span>{t('places.form.type')}</span>
              <select
                id="place-type"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    type: event.target.value as PlaceType,
                  }))
                }
                value={draft.type}
              >
                {placeTypeValues.map((value) => (
                  <option key={value} value={value}>
                    {t(`enum.placeType.${value}`)}
                  </option>
                ))}
              </select>
            </label>

            <label className="stack" htmlFor="parent-place">
              <span>{t('places.form.parent')}</span>
              <select
                id="parent-place"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    parentPlaceId: event.target.value,
                  }))
                }
                value={draft.parentPlaceId}
              >
                <option value="">{t('places.form.noParent')}</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.placePath}
                  </option>
                ))}
              </select>
            </label>

            <div className="panel stack inset-panel">
              <p className="eyebrow">{t('places.form.pathPreview')}</p>
              <strong>{nextPathPreview}</strong>
            </div>

            <div className="actions-row">
              <button
                data-testid="create-place-submit"
                disabled={isCreatingPlace || draft.name.trim().length === 0}
                type="submit"
              >
                {isCreatingPlace ? t('places.form.saving') : t('places.create')}
              </button>
              <button
                className="secondary-button"
                onClick={() => openCreateForm(selectedPlaceId)}
                type="button"
              >
                {t('places.form.reset')}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isShellMode ? (
        <section className="panel stack">
          <p className="eyebrow">{t('places.shellMode')}</p>
          <h3>{t('places.shellModeHeading')}</h3>
          <p className="lede">{t('places.firstCardDescription')}</p>
          {placeSummaries.map((place) => (
            <article className="list-card" key={place.id}>
              <div className="pill-row">
                <span className="pill">{t(`enum.placeStatus.${place.status}`)}</span>
                <span className="pill">{t(`enum.freshnessStatus.${place.freshness}`)}</span>
              </div>
              <strong>{place.name}</strong>
              <span>{place.path}</span>
            </article>
          ))}
        </section>
      ) : null}

      {!isShellMode && placesLoading ? (
        <section className="panel">
          <p>{t('places.loading')}</p>
        </section>
      ) : null}

      {!isShellMode && !placesLoading && places.length === 0 ? (
        <section className="panel stack">
          <p className="eyebrow">{t('places.emptyEyebrow')}</p>
          <h3>{t('places.emptyHeading')}</h3>
          <p className="lede">{t('places.emptyDescription')}</p>
          <div className="actions-row">
            <button data-testid="create-first-place" onClick={() => openCreateForm(null)} type="button">
              {t('places.addFirst')}
            </button>
          </div>
        </section>
      ) : null}

      {!isShellMode && !placesLoading && places.length > 0 ? (
        <section className="stack">
          {selectedPlace ? (
            <section className="panel stack" data-testid="capture-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">{t('places.captureEyebrow')}</p>
                  <h3>{t('places.captureUploadFor', { name: selectedPlace.name })}</h3>
                </div>
              </div>

              <p className="lede">{t('places.captureDescription')}</p>

              <label className="stack" htmlFor="place-capture-input">
                <span>{t('places.captureChoosePhoto')}</span>
                <input
                  accept="image/*"
                  capture="environment"
                  data-testid="place-capture-input"
                  id="place-capture-input"
                  onChange={handleCaptureSelection}
                  type="file"
                />
              </label>

              <div className="actions-row">
                <button className="secondary-button" disabled={isUploadingCapture} type="button">
                  {isUploadingCapture ? t('places.uploadingCapture') : t('places.selectedCaptureStatus')}
                </button>
              </div>

              {capturesLoading ? <p>{t('places.captureLoading')}</p> : null}
              {captures.length > 0 ? (
                <div className="stack">
                  {captures.map((capture) => (
                    <article
                      className="list-card"
                      data-capture-status={capture.status}
                      data-testid="capture-card"
                      key={capture.id}
                    >
                      <div className="pill-row">
                        <span className="pill">{t(`enum.captureStatus.${capture.status}`)}</span>
                        <span className="pill">
                          {capture.photoDeleted ? t('places.photoDeleted') : t('places.photoStored')}
                        </span>
                      </div>
                      <strong>{capture.id}</strong>
                      <span>{capture.photoStoragePath}</span>
                      <small>{t('places.capturedAt', { date: capture.capturedAt })}</small>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="helper-text">{t('places.captureNone')}</p>
              )}
            </section>
          ) : null}

          {visiblePlaces.length === 0 ? (
            <section className="panel stack">
              <p className="eyebrow">{t('places.noChildPlaces')}</p>
              <h3>{selectedPlace ? t('places.addNested') : t('places.noRootPlaces')}</h3>
              <div className="actions-row">
                <button onClick={() => openCreateForm(selectedPlaceId)} type="button">
                  {t('places.addHere')}
                </button>
                {selectedPlace ? (
                  <button
                    className="secondary-button"
                    onClick={() => setSelectedPlaceId(selectedPlace.parentPlaceId)}
                    type="button"
                  >
                    {t('places.goUp')}
                  </button>
                ) : null}
              </div>
            </section>
          ) : (
            visiblePlaces.map((place) => (
              <article className="panel list-card" key={place.id}>
                <div className="pill-row">
                  <span className="pill">{t(`enum.placeType.${place.type}`)}</span>
                  <span className="pill">{t(`enum.placeStatus.${place.status}`)}</span>
                  <span className="pill">{t(`enum.freshnessStatus.${place.freshnessStatus}`)}</span>
                </div>
                <strong>{place.name}</strong>
                <span>{place.placePath}</span>
                <small>{t('places.childPlacesCount', { count: countChildren(places, place.id) })}</small>
                <div className="actions-row">
                  <button data-testid={`open-place-${place.id}`} onClick={() => setSelectedPlaceId(place.id)} type="button">
                    {t('places.open')}
                  </button>
                  <button className="secondary-button" onClick={() => openCreateForm(place.id)} type="button">
                    {t('places.addChild')}
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      ) : null}
    </div>
  )
}
