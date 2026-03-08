import { placeTypeValues, type PlaceRecord, type PlaceType } from '@house-seeker/shared'
import { useMemo, useState } from 'react'
import { placeSummaries } from '@/features/household/mock-data'
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
    : parentPreview?.placePath ?? 'Root place'

  function openCreateForm(parentPlaceId: string | null) {
    setDraft({
      name: '',
      parentPlaceId: parentPlaceId ?? '',
      type: parentPlaceId ? 'container' : 'fixed',
    })
    setFormMessage('')
    setShowForm(true)
  }

  async function handleCreatePlace(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormMessage('')

    try {
      const createdPlace = await createPlace({
        name: draft.name,
        parentPlaceId: draft.parentPlaceId || null,
        type: draft.type,
      })
      setSelectedPlaceId(createdPlace.parentPlaceId ?? null)
      setDraft(initialDraft)
      setShowForm(false)
      setFormMessage(`Created ${createdPlace.placePath}`)
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Unable to create the place.')
    }
  }

  return (
    <div className="stack">
      <section className="panel stack">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Places</p>
            <h2>{selectedPlace ? selectedPlace.name : 'Place hierarchy'}</h2>
          </div>
          <button onClick={() => openCreateForm(selectedPlaceId)} type="button">
            Add place
          </button>
        </div>

        <p className="lede">
          Build the household location tree first. Fixed spaces and nested containers both live in
          the same hierarchy.
        </p>

        {currentChain.length > 0 ? (
          <div className="pill-row">
            <button className="secondary-button" onClick={() => setSelectedPlaceId(null)} type="button">
              All places
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
              <dt>Path</dt>
              <dd>{selectedPlace.placePath}</dd>
            </div>
            <div>
              <dt>Child places</dt>
              <dd>{countChildren(places, selectedPlace.id)}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selectedPlace.status}</dd>
            </div>
            <div>
              <dt>Last verified</dt>
              <dd>{selectedPlace.lastVerifiedAt ?? 'Not captured yet'}</dd>
            </div>
          </div>
        ) : null}

        {formMessage ? <div className="notice">{formMessage}</div> : null}
        {placesError ? <div className="notice">{placesError}</div> : null}
        {createPlaceError ? <div className="notice">{createPlaceError}</div> : null}
      </section>

      {showForm ? (
        <section className="panel stack">
          <div className="section-heading">
            <h3>Create place</h3>
            <button className="secondary-button" onClick={() => setShowForm(false)} type="button">
              Close
            </button>
          </div>

          <form className="stack" onSubmit={handleCreatePlace}>
            <label className="stack" htmlFor="place-name">
              <span>Place name</span>
              <input
                id="place-name"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="White cabinet"
                value={draft.name}
              />
            </label>

            <label className="stack" htmlFor="place-type">
              <span>Place type</span>
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
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="stack" htmlFor="parent-place">
              <span>Parent place</span>
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
                <option value="">No parent (root place)</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.placePath}
                  </option>
                ))}
              </select>
            </label>

            <div className="panel stack inset-panel">
              <p className="eyebrow">Path preview</p>
              <strong>{nextPathPreview}</strong>
            </div>

            <div className="actions-row">
              <button disabled={isCreatingPlace || draft.name.trim().length === 0} type="submit">
                {isCreatingPlace ? 'Saving...' : 'Create place'}
              </button>
              <button
                className="secondary-button"
                onClick={() => openCreateForm(selectedPlaceId)}
                type="button"
              >
                Reset
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {isShellMode ? (
        <section className="panel stack">
          <p className="eyebrow">Shell mode</p>
          <h3>Firebase config missing</h3>
          <p className="lede">
            The live hierarchy is unavailable, so the page is showing placeholder place cards.
          </p>
          {placeSummaries.map((place) => (
            <article className="list-card" key={place.id}>
              <div className="pill-row">
                <span className="pill">{place.status}</span>
                <span className="pill">{place.freshness}</span>
              </div>
              <strong>{place.name}</strong>
              <span>{place.path}</span>
            </article>
          ))}
        </section>
      ) : null}

      {!isShellMode && placesLoading ? (
        <section className="panel">
          <p>Loading places...</p>
        </section>
      ) : null}

      {!isShellMode && !placesLoading && places.length === 0 ? (
        <section className="panel stack">
          <p className="eyebrow">Empty state</p>
          <h3>Add the first storage place</h3>
          <p className="lede">
            Start with rooms, cabinets, drawers, boxes, or bags. You can nest containers later.
          </p>
          <div className="actions-row">
            <button onClick={() => openCreateForm(null)} type="button">
              Create first place
            </button>
          </div>
        </section>
      ) : null}

      {!isShellMode && !placesLoading && places.length > 0 ? (
        <section className="stack">
          {visiblePlaces.length === 0 ? (
            <section className="panel stack">
              <p className="eyebrow">No child places</p>
              <h3>{selectedPlace ? 'Add a nested container or sub-place' : 'No root places found'}</h3>
              <div className="actions-row">
                <button onClick={() => openCreateForm(selectedPlaceId)} type="button">
                  Add place here
                </button>
                {selectedPlace ? (
                  <button
                    className="secondary-button"
                    onClick={() => setSelectedPlaceId(selectedPlace.parentPlaceId)}
                    type="button"
                  >
                    Go up
                  </button>
                ) : null}
              </div>
            </section>
          ) : (
            visiblePlaces.map((place) => (
              <article className="panel list-card" key={place.id}>
                <div className="pill-row">
                  <span className="pill">{place.type}</span>
                  <span className="pill">{place.status}</span>
                  <span className="pill">{place.freshnessStatus}</span>
                </div>
                <strong>{place.name}</strong>
                <span>{place.placePath}</span>
                <small>{countChildren(places, place.id)} child places</small>
                <div className="actions-row">
                  <button onClick={() => setSelectedPlaceId(place.id)} type="button">
                    Open
                  </button>
                  <button className="secondary-button" onClick={() => openCreateForm(place.id)} type="button">
                    Add child
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
