import {
  Search,
  MoreHorizontal,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
  ChevronRight,
} from 'lucide-react'
import { IconButton } from '../components/icon-button'
import { Table } from '../components/table/table'
import { TableHeader } from '../components/table/table-header'
import { TableCell } from '../components/table/table-cell'
import { TableFooterCell } from '../components/table/table-footer-cell'
import { TableRow } from '../components/table/table-row'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface AttendeesProps {
  id: string
  name: string
  email: string
  checkedInAt: string | null
  createdAt: string
}

export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('search')) {
      return url.searchParams.get('search') ?? ''
    }

    return ''
  })

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString())

    if (url.searchParams.has('page')) {
      return Number(url.searchParams.get('page'))
    }

    return 1
  })

  const [total, setTotal] = useState(0)
  const [attendees, setAttendees] = useState<AttendeesProps[]>([])

  const totalPages = Math.ceil(total / 10)

  useEffect(() => {
    const url = new URL(
      'http://localhost:3333/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees',
    )

    url.searchParams.set('pageIndex', String(page - 1))

    if (search.length > 0) {
      url.searchParams.set('query', search)
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setAttendees(data.attendees)
        setTotal(data.total)
      })
  }, [page, search])

  function setCurrentSearch(search: string) {
    const url = new URL(window.location.toString())
    url.searchParams.set('search', search)
    window.history.pushState({}, '', url)
    setSearch(search)
  }

  function setCurrentPage(page: number) {
    const url = new URL(window.location.toString())
    url.searchParams.set('page', String(page))
    window.history.pushState({}, '', url)
    setPage(page)
  }

  function onSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(event.target.value)
    setCurrentPage(1)
  }

  function goToPreviousPage() {
    setCurrentPage(page - 1)
  }

  function goToNextPage() {
    setCurrentPage(page + 1)
  }

  function goToFirstPage() {
    setCurrentPage(1)
  }

  function goToLastPage() {
    setCurrentPage(totalPages)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="w-72 flex items-center gap-3 px-3 py-1.5 border border-white/10 rounded-lg text-sm">
          <Search className="size-4 text-emerald-300" />
          <input
            onChange={onSearchInputChange}
            value={search}
            type="text"
            placeholder="Buscar participante"
            className="flex-1 bg-transparent outline-none border-0 p-0 text-sm focus:ring-0"
          />
        </div>
      </div>
      <Table>
        <thead>
          <tr className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data da inscrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 48 }}></TableHeader>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(attendee.createdAt)}</TableCell>
                <TableCell>
                  {attendee.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez o check-in</span>
                  ) : (
                    dayjs().to(attendee.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <TableFooterCell>
              Mostrando {attendees.length} de {total} items
            </TableFooterCell>
            <TableFooterCell right>
              <div className="inline-flex items-center gap-8">
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton onClick={goToFirstPage} disabled={page === 1}>
                    <ChevronsLeft className="size-4" />
                  </IconButton>
                  <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                    <ChevronLeft className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToNextPage}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </IconButton>
                  <IconButton
                    onClick={goToLastPage}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4" />
                  </IconButton>
                </div>
              </div>
            </TableFooterCell>
          </tr>
        </tfoot>
      </Table>
    </div>
  )
}
